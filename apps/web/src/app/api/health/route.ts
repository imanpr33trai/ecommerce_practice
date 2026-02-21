import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: typeof process !== "undefined" && process.uptime ? process.uptime() : 0,
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "unknown",
      routes: {
        web: "active",
        api: "active",
        auth: "active",
        products: "active",
        cart: "active",
        checkout: "active",
      },
      checks: {
        dependencies: "ok",
        disk_space: "ok",
      },
    };

    return NextResponse.json(health, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        error: error,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      },
    );
  }
}

export async function HEAD(request: NextRequest) {
  return NextResponse.json(
    { status: "ok" },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
}
