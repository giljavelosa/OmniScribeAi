"""
Pyannote Speaker Diarization Microservice

Optional enterprise/premium service for acoustic speaker verification.
Not required for MVP — LLM-based diarization handles 90-95% of cases.

Endpoint:
  POST /diarize
  - Accepts WAV audio file
  - Returns speaker segments with timestamps

Deployment:
  - DigitalOcean droplet (CPU) or RunPod serverless (GPU)
  - Only deploy when enterprise customers request acoustic verification
"""

import os
import io
import time
import logging
from typing import List

from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pyannote-service")

app = FastAPI(
    title="OmniScribe Pyannote Diarization Service",
    version="0.1.0",
    description="Acoustic speaker diarization for clinical encounters (enterprise/premium)",
)

# ── Auth ─────────────────────────────────────────────────────

DIARIZE_API_KEY = os.environ.get("DIARIZE_API_KEY", "")


def verify_api_key(authorization: str = Header(default="")):
    if not DIARIZE_API_KEY:
        return  # No key configured = open (dev mode)
    if authorization != f"Bearer {DIARIZE_API_KEY}":
        raise HTTPException(status_code=401, detail="Invalid API key")


# ── Models ───────────────────────────────────────────────────


class SpeakerSegment(BaseModel):
    speaker: str  # "SPEAKER_00", "SPEAKER_01", etc.
    start: float  # seconds
    end: float  # seconds


class DiarizeResponse(BaseModel):
    success: bool
    segments: List[SpeakerSegment]
    num_speakers: int
    processing_time: float
    audio_duration: float


# ── Lazy model loading ───────────────────────────────────────

_pipeline = None


def get_pipeline():
    """Lazy-load pyannote pipeline on first request."""
    global _pipeline
    if _pipeline is not None:
        return _pipeline

    hf_token = os.environ.get("HF_TOKEN")
    if not hf_token:
        raise HTTPException(
            status_code=500,
            detail="HF_TOKEN not set. Required for pyannote model access.",
        )

    try:
        from pyannote.audio import Pipeline

        logger.info("Loading pyannote/speaker-diarization-3.1 pipeline...")
        _pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            use_auth_token=hf_token,
        )
        logger.info("Pipeline loaded successfully")
        return _pipeline
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="pyannote.audio not installed. Run: pip install pyannote.audio",
        )
    except Exception as e:
        logger.error(f"Failed to load pipeline: {e}")
        raise HTTPException(status_code=500, detail=f"Pipeline load failed: {str(e)}")


# ── Endpoints ────────────────────────────────────────────────


@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": _pipeline is not None}


@app.post("/diarize", response_model=DiarizeResponse)
async def diarize(
    file: UploadFile = File(...),
    authorization: str = Header(default=""),
):
    """
    Perform acoustic speaker diarization on a WAV file.

    Returns speaker segments with timestamps.
    Typical processing time: 10-30s for a 50-min recording (GPU),
    60-120s on CPU.
    """
    verify_api_key(authorization)

    if not file.filename or not file.filename.lower().endswith(".wav"):
        raise HTTPException(status_code=400, detail="Only WAV files are supported")

    start_time = time.time()

    # Read audio into memory
    audio_bytes = await file.read()
    if len(audio_bytes) < 1000:
        raise HTTPException(status_code=400, detail="Audio file too small")

    logger.info(
        f"Diarization request: {file.filename}, {len(audio_bytes)} bytes"
    )

    pipeline = get_pipeline()

    # Run diarization
    try:
        import torch
        import torchaudio

        # Load audio from bytes
        audio_tensor, sample_rate = torchaudio.load(io.BytesIO(audio_bytes))
        audio_duration = audio_tensor.shape[1] / sample_rate

        # Resample to 16kHz if needed
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            audio_tensor = resampler(audio_tensor)
            sample_rate = 16000

        # Run pipeline
        waveform = {"waveform": audio_tensor, "sample_rate": sample_rate}
        diarization = pipeline(waveform)

        # Extract segments
        segments: List[SpeakerSegment] = []
        speakers = set()

        for turn, _, speaker in diarization.itertracks(yield_label=True):
            segments.append(
                SpeakerSegment(
                    speaker=speaker,
                    start=round(turn.start, 3),
                    end=round(turn.end, 3),
                )
            )
            speakers.add(speaker)

        processing_time = round(time.time() - start_time, 2)

        logger.info(
            f"Diarization complete: {len(segments)} segments, "
            f"{len(speakers)} speakers, {processing_time}s"
        )

        return DiarizeResponse(
            success=True,
            segments=segments,
            num_speakers=len(speakers),
            processing_time=processing_time,
            audio_duration=round(audio_duration, 2),
        )

    except Exception as e:
        logger.error(f"Diarization failed: {e}")
        raise HTTPException(status_code=500, detail=f"Diarization failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8765)
