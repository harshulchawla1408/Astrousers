import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const backendResponse = await fetch(
      "http://localhost:5000/api/calendar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // forward auth header if needed later
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
