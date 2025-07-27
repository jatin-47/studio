
"use server";
import { cookies } from "next/headers";
import { authAdmin } from "@/lib/firebase-admin";

export async function login(idToken: string): Promise<{ success: boolean; error?: string; role?: string }> {
  try {
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    
    // Fetch user to get custom claims (role) and photoURL
    const user = await authAdmin.getUser(decodedToken.uid);
    const role = (user.customClaims?.role as string) || 'attendee';

    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });

    cookies().set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    
    return { success: true, role };
  } catch (error: any) {
    console.error("Error creating session cookie:", error);
    return { success: false, error: "Failed to create session." };
  }
}

export async function logout(): Promise<{ success: boolean }> {
  cookies().delete("session");
  return { success: true };
}

export async function getSession(): Promise<{ user: { uid: string; email?: string; name?: string; role?: string; photoURL?: string; } | null }> {
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
        role: (user.customClaims?.role as string) || 'attendee',
        photoURL: user.photoURL
      },
    };
  } catch (error) {
    // Session cookie is invalid or expired.
    cookies().delete("session");
    return { user: null };
  }
}
