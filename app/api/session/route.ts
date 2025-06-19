import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

const SESSION_DURATION = 60 * 60 * 24 * 7; // 1 week

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    console.log("Received idToken:", idToken);
    if (!idToken) {
      return NextResponse.json({ success: false, message: "Missing idToken" }, { status: 400 });
    }
    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000,
    });
    // Set cookie in response
    const res = NextResponse.json({ success: true });
    res.cookies.set("session", sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return res;
  } catch (error) {
    console.error("/api/session error:", error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    return NextResponse.json({
      name: user.name,
      email: user.email,
      profileURL: user.profileURL || "",
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
