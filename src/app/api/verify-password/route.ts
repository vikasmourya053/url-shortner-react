import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body.code !== "string" || typeof body.password !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_BASE_URL}/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: body.code, password: body.password }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
