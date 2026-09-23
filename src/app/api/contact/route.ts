import { NextResponse } from "next/server";

// In-memory backend storage running inside the serverless instance
interface StoredMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

const messageStore: StoredMessage[] = [];

export async function GET() {
  return NextResponse.json({ success: true, count: messageStore.length, messages: messageStore });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Server-side input validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation failed: all fields are strictly required." },
        { status: 400 }
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { success: false, error: "Validation failed: invalid email address format." },
        { status: 400 }
      );
    }

    const newMessage: StoredMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    messageStore.unshift(newMessage);

    return NextResponse.json(
      {
        success: true,
        message: "Message dispatched and recorded successfully.",
        record: newMessage,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorText = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorText }, { status: 500 });
  }
}