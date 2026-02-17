import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
export const maxDuration = 300;
import { NextRequest, NextResponse } from 'next/server';


async function callClaude(messages: any[], maxTokens: number = 4096) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} — ${errorText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

function parseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse JSON from response');
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const frameworkId = formData.get('frameworkId') as string || '';
    const existingFacts = formData.get('existingFacts') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Determine media type
    const mimeType = file.type || 'image/jpeg';
    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    
    if (!supportedTypes.includes(mimeType)) {
      return NextResponse.json({ 
        error: `Unsupported file type: ${mimeType}. Supported: JPEG, PNG, GIF, WebP, PDF` 
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Step 1: OCR — Extract all text and structured data from document
    const ocrText = await callClaude([
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType === 'application/pdf' ? 'image/jpeg' : mimeType,
              data: base64,
            },
          },
          {
            type: 'text',
            text: `You are a medical document OCR specialist. Extract ALL text from this clinical document image.

INSTRUCTIONS:
1. Extract every piece of text visible in the document, preserving structure
2. Identify the document type (e.g., referral, intake form, outcome measure, lab result, imaging report, insurance auth, medication list, patient demographics, vital signs, range of motion measurements, manual muscle testing, goniometer readings, functional assessment, etc.)
3. For forms with checkboxes, indicate which are checked vs unchecked
4. For handwritten text, do your best to read it and mark uncertain readings with [?]
5. Preserve table structures where present
6. Note any scores, measurements, or numeric values prominently

Return as JSON:
{
  "document_type": "string — type of clinical document",
  "document_title": "string — title if visible",
  "date": "string — document date if visible, or null",
  "patient_name": "string — patient name if visible, or null",
  "provider_name": "string — provider name if visible, or null",
  "raw_text": "string — full extracted text preserving structure",
  "structured_data": {
    // Key-value pairs of all identifiable data fields
  },
  "scores": [
    // Any standardized outcome scores/measures found
    // { "measure": "name", "value": "score", "date": "if visible" }
  ],
  "measurements": [
    // Any physical measurements (ROM, strength, girth, etc.)
    // { "type": "ROM", "body_part": "shoulder flexion", "value": "95 degrees", "side": "left" }
  ],
  "vitals": {
    // Any vital signs if present
  },
  "medications": [
    // { "name": "string", "dose": "string", "frequency": "string" }
  ],
  "diagnoses": [
    // { "description": "string", "icd_code": "string or null" }
  ],
  "confidence": "high | medium | low",
  "notes": "string — any issues or uncertain readings"
}

Return ONLY valid JSON, no markdown.`,
          },
        ],
      },
    ]);

    const ocrData = parseJSON(ocrText);

    // Step 2: Map OCR data to clinical note sections
    const mappingText = await callClaude([
      {
        role: 'user',
        content: `You are a clinical documentation specialist. Map the following OCR-extracted document data to clinical note sections.

DOCUMENT DATA:
${JSON.stringify(ocrData, null, 2)}

${existingFacts ? `EXISTING PARSED DATA (already in the note):
${existingFacts}

IMPORTANT: Only return NEW information not already in the existing data. Do not duplicate.` : ''}

FRAMEWORK: ${frameworkId || 'general clinical note'}

INSTRUCTIONS:
1. Organize the extracted data into clinical note sections
2. Format professionally for a clinical note
3. For measurements and scores, include units and reference ranges if known
4. Flag any values that appear abnormal or clinically significant
5. Use the three-tier rule:
   - Tier 1: Data explicitly in document → exact value
   - Tier 2: Field marked normal → "WNL"  
   - Tier 3: Field not in document → omit (don't fabricate)

Return as JSON:
{
  "document_type": "${ocrData.document_type || 'unknown'}",
  "sections": [
    {
      "title": "string — section name",
      "content": "string — formatted clinical content",
      "source": "document_scan",
      "is_new_data": true
    }
  ],
  "key_findings": [
    "string — most important clinical data points"
  ],
  "merge_suggestions": "string — how this data integrates with existing note"
}

Return ONLY valid JSON, no markdown.`,
      },
    ]);

    const mappingData = parseJSON(mappingText);
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);

    return NextResponse.json({
      success: true,
      ocr: ocrData,
      mapping: mappingData,
      processingTime: parseFloat(processingTime),
      fileName: file.name,
      fileSize: file.size,
    });

  } catch (error: any) {
    console.error('OCR error:', error);
    return NextResponse.json(
      { error: error.message || 'OCR processing failed' },
      { status: 500 }
    );
  }
}
