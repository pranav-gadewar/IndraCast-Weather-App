import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { generateResetToken } from "@/lib/authServer";
import {
  getFirestoreUserByEmail,
  updateFirestoreUserFields,
} from "@/lib/firestoreRest";

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await getFirestoreUserByEmail(normalizedEmail);

    // Return friendly generic response even if user doesn't exist (prevents email enumeration)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent to your inbox.",
      });
    }

    // Generate reset token and 15-minute expiration timestamp
    const { token, expires } = generateResetToken();
    const saved = await updateFirestoreUserFields(user.id, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to generate password reset link. Please try again." },
        { status: 500 }
      );
    }

    // Build reset URL
    const origin = request.nextUrl.origin || "https://indra-cast-weather-app.vercel.app";
    const resetUrl = `${origin}/auth/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

    // Dispatch email if SMTP configured
    if (SMTP_EMAIL && SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: SMTP_EMAIL,
          pass: SMTP_PASSWORD,
        },
      });

      const safeName = escapeHtml(user.name || "User");
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #2563eb; margin-bottom: 10px;">IndraCast Password Reset Request</h2>
          <p style="color: #333333; font-size: 14px;">Hello <strong>${safeName}</strong>,</p>
          <p style="color: #555555; font-size: 14px; line-height: 1.5;">
            We received a request to reset the password for your IndraCast account. Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #777777; font-size: 12px;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <p style="color: #999999; font-size: 11px; text-align: center;">&copy; ${new Date().getFullYear()} IndraCast. All rights reserved.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"IndraCast Security" <${SMTP_EMAIL}>`,
        to: normalizedEmail,
        subject: "IndraCast Password Reset Request",
        html: htmlContent,
      });
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent to your inbox.",
    });
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error("Error in /api/auth/forgot-password:", errorObj.message || err);
    return NextResponse.json(
      { success: false, error: errorObj.message || "Server error sending reset link." },
      { status: 500 }
    );
  }
}
