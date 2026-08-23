import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required fields." },
        { status: 400 }
      );
    }

    const smtpEmail = process.env.SMTP_EMAIL || "pranav.gadewar.dev@gmail.com";
    const smtpPassword = process.env.SMTP_PASSWORD || "ijrl dvay luow wzgu";

    // Create Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const mailOptions = {
      from: `"${name} (via IndraCast)" <${smtpEmail}>`,
      replyTo: email,
      to: smtpEmail,
      subject: `🌤️ [IndraCast Contact Form] New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #1e293b; margin: 0;">IndraCast Weather App</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">New Direct Contact Form Submission</p>
          </div>

          <div style="margin-bottom: 16px;">
            <strong style="color: #475569; font-size: 13px; text-transform: uppercase;">Sender Name:</strong>
            <p style="color: #0f172a; font-size: 16px; font-weight: bold; margin: 4px 0 16px 0;">${name}</p>
          </div>

          <div style="margin-bottom: 16px;">
            <strong style="color: #475569; font-size: 13px; text-transform: uppercase;">Sender Email:</strong>
            <p style="color: #2563eb; font-size: 16px; font-weight: bold; margin: 4px 0 16px 0;">
              <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
            </p>
          </div>

          <div style="margin-bottom: 24px;">
            <strong style="color: #475569; font-size: 13px; text-transform: uppercase;">Message Content:</strong>
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin-top: 8px; border-radius: 8px; color: #334155; font-size: 15px; line-height: 1.6; whitespace: pre-wrap;">
              ${message}
            </div>
          </div>

          <div style="border-top: 1px solid #f1f5f9; pt: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
            Transmitted via IndraCast Meteorological Portal API • ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST
          </div>
        </div>
      `,
    };

    // Send email via SMTP
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Your message has been transmitted successfully!",
    });
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error("Error sending contact email via SMTP:", err);
    return NextResponse.json(
      {
        success: false,
        error: errorObj.message || "Failed to transmit message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
