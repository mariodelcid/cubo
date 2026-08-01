import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const checks: Record<string, string> = {
    service: "ok",
  };

  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch (error) {
    checks.database = "error";
    return NextResponse.json(
      {
        status: "degraded",
        service: "cubo",
        checks,
        error: error instanceof Error ? error.message : "Database unreachable",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: "ok",
    service: "cubo",
    checks,
    timestamp: new Date().toISOString(),
  });
}
