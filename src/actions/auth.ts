
"use server";
import { cookies } from "next/headers";
import { authAdmin } from "@/lib/firebase-admin";

export async function login(idToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    const { uid } = decodedToken;

    // Session cookie expires in 14 days
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });
    
    cookies().set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return { success: false, error: "Failed to create session." };
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
