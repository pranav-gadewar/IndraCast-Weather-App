import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyPassword } from "@/lib/authServer";
import {
  getFirestoreUserByEmail,
  updateFirestoreUserFields,
} from "@/lib/firestoreRest";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";

const MAX_PASSWORD_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await getFirestoreUserByEmail(normalizedEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Password authentication is not configured for this account. Try passcode login or reset your password." },
        { status: 401 }
      );
    }

    if (user.failedPasswordAttempts >= MAX_PASSWORD_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          error: "You've reached the maximum password attempts. Please reset your password.",
          lockout: true,
        },
        { status: 403 }
      );
    }

    const match = await verifyPassword(password, user.passwordHash);

    if (!match) {
      const newFailCount = user.failedPasswordAttempts + 1;
      await updateFirestoreUserFields(user.id, { failedPasswordAttempts: newFailCount });

      if (newFailCount >= MAX_PASSWORD_ATTEMPTS) {
        return NextResponse.json(
          {
            success: false,
            error: "You've reached the maximum password attempts. Please reset your password.",
            lockout: true,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Reset failed password attempts on successful match
    await updateFirestoreUserFields(user.id, { failedPasswordAttempts: 0 });

    // Issue Signed Session Cookie
    const sessionToken = await createSessionToken(user.id, user.role);
    const response = NextResponse.json({
      success: true,
      uid: user.id,
      role: user.role,
      message: "Login successful.",
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error("Error in /api/auth/login:", errorObj.message || err);
    return NextResponse.json(
      { success: false, error: errorObj.message || "Server error logging in." },
      { status: 500 }
    );
  }
}
