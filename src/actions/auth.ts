
"use server";
import { cookies } from "next/headers";
import { authAdmin } from "@/lib/firebase-admin";
import sgMail from '@sendgrid/mail';

// In-memory store for OTPs for this example. 
// In a production app, use a more persistent and scalable store like Firestore or Redis.
const otpStore: { [email: string]: { otp: string; expires: number } } = {};

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function login(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    const storedOtpData = otpStore[email];

    if (!storedOtpData) {
      return { success: false, error: "No OTP was requested for this email." };
    }

    if (Date.now() > storedOtpData.expires) {
      delete otpStore[email];
      return { success: false, error: "OTP has expired. Please request a new one." };
    }

    if (otp !== storedOtpData.otp) {
      return { success: false, error: "Invalid OTP." };
    }

    // OTP is valid, proceed with login
    delete otpStore[email]; // Clear OTP after successful use

    const userRecord = await authAdmin.getUserByEmail(email);
    const { uid } = userRecord;

    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
    
    // Create a custom token to include any custom claims you might have
    const customToken = await authAdmin.createCustomToken(uid);
    
    // The session cookie will now contain the custom claims from the token
    const sessionCookie = await authAdmin.createSessionCookie(customToken, { expiresIn });

    cookies().set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Error creating session cookie:", error);
    if (error.code === 'auth/user-not-found') {
        return { success: false, error: "You cannot login. Please contact an administrator." };
    }
    return { success: false, error: "Failed to create session." };
  }
}


export async function sendOtp(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        await authAdmin.getUserByEmail(email);
        
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set an expiration for 10 minutes from now
        const expires = Date.now() + 10 * 60 * 1000;

        // Store the OTP and its expiration
        otpStore[email] = { otp, expires };
        
        if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
            console.error("SendGrid API Key or From Email is not configured.");
            // For testing purposes, log the OTP if SendGrid isn't set up
            console.log(`OTP for ${email}: ${otp}`);
            return { success: true, error: "Email service not configured; OTP logged to console for testing." };
        }

        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: 'Your Drishti Login OTP',
          text: `Your One-Time Password is: ${otp}`,
          html: `<strong>Your One-Time Password is: ${otp}</strong>`,
        };

        await sgMail.send(msg);

        return { success: true };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return { success: false, error: "You cannot login. Please contact an administrator." };
        }
        console.error("Error in sendOtp:", error);
        if(error.response) console.error(error.response.body);

        return { success: false, error: "An unexpected error occurred while sending OTP." };
    }
}


export async function logout(): Promise<{ success: boolean }> {
  cookies().delete("session");
  return { success: true };
}

export async function getSession(): Promise<{ user: { uid: string; email?: string; name?: string; role?: string } | null }> {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) {
      return { user: null };
    }
    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const user = await authAdmin.getUser(decodedClaims.uid);

    return {
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        name: user.displayName || decodedClaims.email?.split('@')[0],
        role: (decodedClaims.role as string) || 'attendee',
      },
    };
  } catch (error) {
    // Session cookie is invalid or expired.
    // Force user to login again.
    cookies().delete("session");
    return { user: null };
  }
}
