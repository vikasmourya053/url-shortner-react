import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body.url !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_BASE_URL}/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: body.url, alias: body.alias || "", ttl: body.ttl || 0, password: body.password || "", maxClicks: body.maxClicks || 0 }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Backend error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}


