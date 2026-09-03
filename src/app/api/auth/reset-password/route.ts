import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hashPassword } from "@/lib/authServer";
import {
  getFirestoreUserByEmail,
  updateFirestoreUserFields,
} from "@/lib/firestoreRest";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, token, and new password are required." },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await getFirestoreUserByEmail(normalizedEmail);

    if (!user || user.passwordResetToken !== token) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired password reset link. Please request a new one." },
        { status: 400 }
      );
    }

    if (!user.passwordResetExpires || Date.now() > user.passwordResetExpires) {
      return NextResponse.json(
        { success: false, error: "Password reset link has expired. Please request a new link." },
        { status: 400 }
      );
    }

    // Hash new password & clear reset token
    const passwordHash = await hashPassword(newPassword);
    const updated = await updateFirestoreUserFields(user.id, {
      passwordHash,
      passwordResetToken: "",
      passwordResetExpires: 0,
      failedPasswordAttempts: 0,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully! You can now log in with your new password.",
    });
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error("Error in /api/auth/reset-password:", errorObj.message || err);
    return NextResponse.json(
      { success: false, error: errorObj.message || "Server error resetting password." },
      { status: 500 }
    );
  }
}
