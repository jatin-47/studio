
"use server";
import { cookies } from "next/headers";
import { authAdmin } from "@/lib/firebase-admin";
import { users } from "@/lib/data"; // Using mock data for user lookup

export async function login(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  // In a real app, you would verify the OTP with a service. Here, we'll simulate it.
  if (otp !== "123456") {
    return { success: false, error: "Invalid OTP." };
  }

  try {
    const userRecord = await authAdmin.getUserByEmail(email);
    const { uid } = userRecord;

    // Session cookie expires in 14 days
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    
    // We need to create a custom token to include the custom claims for the session cookie
    const customToken = await authAdmin.createCustomToken(uid);
    
    // The session cookie will now contain the custom claims
    const sessionCookie = await authAdmin.createSessionCookie(customToken, { expiresIn });

    cookies().set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });
    
    return { success: true };
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return { success: false, error: "You cannot login. Please contact an administrator." };
    }
    console.error("Error creating session cookie:", error);
    return { success: false, error: "Failed to create session." };
  }
}


export async function sendOtp(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        await authAdmin.getUserByEmail(email);
        // In a real application, you would integrate with an email service to send the OTP.
        // For this simulation, we just confirm the user exists.
        return { success: true };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return { success: false, error: "You cannot login. Please contact an administrator." };
        }
        console.error("Error checking user:", error);
        return { success: false, error: "An unexpected error occurred." };
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
