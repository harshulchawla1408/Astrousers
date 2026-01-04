import { NextResponse } from "next/server";

const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");
const KUNDLI_MATCHING_URL = `${BACKEND_BASE_URL}/api/astrology/kundli/matching/advanced`;

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Method Not Allowed",
    },
    { status: 405 }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(KUNDLI_MATCHING_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type");
    let payload;

    if (contentType && contentType.includes("application/json")) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = {
        success: response.ok,
        message: text || "Unexpected response from backend",
      };
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Kundli matching proxy failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process kundli matching request",
      },
      { status: 500 }
    );
  }
}
