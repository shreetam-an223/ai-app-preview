import { NextRequest, NextResponse } from "next/server";

// Serverless route runtime configuration
export const runtime = "nodejs";
export const maxDuration = 10; // Explicit 10-second timeout to prevent hanging connections

// In-memory sliding rate-limit tracker (IP-based)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5;   // Max 5 submissions per IP per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP extraction & Abuse Defense
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous-client";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 5 transmissions per minute allowed." },
        { status: 429 }
      );
    }

    // 2. Parse & validate input payload
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Validation failure: All payload fields are strictly required." },
        { status: 400 }
      );
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    const trimmedMessage = String(message).trim();

    // 3. Strict Input Size Caps (Prevent memory exhaustion & credit drain)
    if (trimmedName.length > 80) {
      return NextResponse.json({ error: "Name payload exceeds 80 character limit." }, { status: 400 });
    }
    if (trimmedEmail.length > 120) {
      return NextResponse.json({ error: "Email payload exceeds 120 character limit." }, { status: 400 });
    }
    if (trimmedMessage.length > 2000) {
      return NextResponse.json({ error: "Message payload exceeds 2,000 character limit." }, { status: 400 });
    }

    // 4. Strict Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email format supplied." }, { status: 400 });
    }

    // 5. Successful ingestion response
    const submissionId = `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          id: submissionId,
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON payload or server pipeline failure." },
      { status: 400 }
    );
  }
}