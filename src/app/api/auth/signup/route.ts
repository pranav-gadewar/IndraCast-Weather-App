import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import { hashPassword } from "@/lib/authServer";
import {
  getFirestoreUserByEmail,
  updateFirestoreUserFields,
  type FirestoreFieldValue,
} from "@/lib/firestoreRest";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";
import { getSystemSettings } from "@/lib/systemSettings";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, gender, age, city, state, country } = body;

    // 1. Check System Registration Setting
    const settings = await getSystemSettings();
    if (!settings.userRegistration) {
      return NextResponse.json(
        { success: false, error: "New user registrations are currently paused by system administration." },
        { status: 403 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Email, Password)." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password should be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // 2. Check for Existing Email
    const existingUser = await getFirestoreUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "This email address is already registered." },
        { status: 400 }
      );
    }

    // 3. Hash Password & Prepare User Record
    const passwordHash = await hashPassword(password);
    const uid = crypto.randomUUID();

    const userFields: Record<string, FirestoreFieldValue> = {
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: "user",
      phone: phone ? String(phone).trim() : "",
      gender: gender ? String(gender).trim() : "",
      age: age ? Number(age) : 0,
      city: city ? String(city).trim() : "",
      state: state ? String(state).trim() : "",
      country: country ? String(country).trim() : "India",
      passcodeConfigured: false,
      failedPasswordAttempts: 0,
      failedPasscodeAttempts: 0,
    };

    const saved = await updateFirestoreUserFields(uid, userFields);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to create user profile. Please try again." },
        { status: 500 }
      );
    }

    // 4. Issue Signed Session Cookie
    const sessionToken = await createSessionToken(uid, "user");
    const response = NextResponse.json({
      success: true,
      uid,
      role: "user",
      message: "Account created successfully.",
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
    console.error("Error in /api/auth/signup:", errorObj.message || err);
    return NextResponse.json(
      { success: false, error: errorObj.message || "Server error creating account." },
      { status: 500 }
    );
  }
}
