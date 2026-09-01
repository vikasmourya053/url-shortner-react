import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/analytics`);
    
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Failed to fetch analytics" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Request to backend failed" }, { status: 500 });
  }
}
