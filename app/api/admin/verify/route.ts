import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = (await request.json().catch(() => ({ password: "" }))) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD || "family-admin";

  if (!safeEqual(password || "", expected)) {
    return NextResponse.json({ ok: false, message: "管理密码不正确" }, { status: 401 });
  }

  const secret = process.env.ADMIN_SESSION_SECRET || "dev-family-ordering-session-secret";
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const value = `${expiresAt}.${sign(String(expiresAt), secret)}`;
  const response = NextResponse.json({ ok: true });
  response.cookies.set("family_admin_session", value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}
