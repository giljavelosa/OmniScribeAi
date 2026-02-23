import { auth } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { callAIVision } from "@/lib/ai-provider";
import { appLog, scrubError, errorCode } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

function parseJSON(text: string) {
  try { return JSON.parse(text); } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error("Failed to parse JSON");
  }
}

const PROMPTS: Record<string, string> = {
  drivers_license: `Extract all information from this driver's license / government ID. Return ONLY valid JSON:
{
  "firstName": "string or null",
  "lastName": "string or null",
  "middleName": "string or null",
  "dateOfBirth": "YYYY-MM-DD or null",
  "gender": "MALE|FEMALE|OTHER or null",
  "addressLine1": "string or null",
  "city": "string or null",
  "state": "string or null",
  "zip": "string or null",
  "idNumber": "string or null",
  "expirationDate": "string or null",
  "confidence": "high|medium|low"
}`,

  insurance_front: `Extract all information from the FRONT of this insurance card. Return ONLY valid JSON:
{
  "payerName": "string — insurance company name",
  "planName": "string or null",
  "planType": "HMO|PPO|EPO|POS|Medicare|Medicaid|Other or null",
  "memberId": "string or null",
  "groupNumber": "string or null",
  "subscriberName": "string or null",
  "effectiveDate": "string or null",
  "copay": "string or null — e.g. $25 office visit",
  "rxBin": "string or null",
  "rxPcn": "string or null",
  "rxGroup": "string or null",
  "confidence": "high|medium|low"
}`,

  insurance_back: `Extract all information from the BACK of this insurance card. Return ONLY valid JSON:
{
  "claimsAddress": "string or null",
  "claimsPhone": "string or null",
  "memberServicesPhone": "string or null",
  "preAuthPhone": "string or null",
  "pharmacyPhone": "string or null",
  "providerPhone": "string or null",
  "mentalHealthPhone": "string or null",
  "deductible": "string or null",
  "outOfPocketMax": "string or null",
  "coinsurance": "string or null",
  "confidence": "high|medium|low"
}`,

  intake_form: `Extract all patient information from this intake/registration form. Return ONLY valid JSON:
{
  "demographics": {
    "firstName": null, "lastName": null, "dateOfBirth": null, "gender": null,
    "phone": null, "email": null, "address": null, "maritalStatus": null,
    "preferredLanguage": null, "emergencyContactName": null, "emergencyContactPhone": null,
    "emergencyContactRelation": null
  },
  "medical": {
    "allergies": [{"substance": "string", "reaction": "string or null"}],
    "medications": [{"name": "string", "dose": "string or null", "frequency": "string or null"}],
    "conditions": [{"description": "string", "icdCode": "string or null"}],
    "surgicalHistory": ["string"],
    "familyHistory": ["string"],
    "socialHistory": {"smoking": null, "alcohol": null, "drugs": null, "occupation": null}
  },
  "insurance": {
    "payerName": null, "memberId": null, "groupNumber": null
  },
  "confidence": "high|medium|low"
}`,

  referral: `Extract referral information from this document. Return ONLY valid JSON:
{
  "referringProvider": "string or null",
  "referringProviderNpi": "string or null",
  "referringFacility": "string or null",
  "referringPhone": "string or null",
  "referringFax": "string or null",
  "patientName": "string or null",
  "dateOfBirth": "string or null",
  "diagnosis": [{"description": "string", "icdCode": "string or null"}],
  "reasonForReferral": "string or null",
  "authorizationNumber": "string or null",
  "authorizedVisits": "number or null",
  "effectiveDate": "string or null",
  "expirationDate": "string or null",
  "confidence": "high|medium|low"
}`,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const docType = (formData.get("type") as string) || "intake_form";

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = file.type || "image/jpeg";

  const prompt = PROMPTS[docType] || PROMPTS.intake_form;

  try {
    const result = await callAIVision([{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
        { type: "text", text: prompt },
      ],
    }]);
    const extracted = parseJSON(result.content);

    await auditLog({
      userId: (session.user as any).id,
      action: "OCR_SCAN",
      details: { docType, fileName: file.name, confidence: extracted.confidence },
    });

    return NextResponse.json({ success: true, type: docType, data: extracted }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (err: unknown) {
    const code = errorCode();
    appLog("error", "OCR-Scan", "Processing error", { code, error: scrubError(err) });
    return NextResponse.json({ error: "OCR scan failed", code }, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
