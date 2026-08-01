import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "cubo",
    timestamp: new Date().toISOString(),
  });
}
