
"use server";

import { authAdmin } from "@/lib/firebase-admin";
import { User } from "@/lib/types";

export async function updateUserProfile(uid: string, data: { photoURL?: string, name?: string }): Promise<{ success: boolean; user?: Partial<User>; error?: string }> {
  try {
    const updatedUser = await authAdmin.updateUser(uid, data);
    return { 
        success: true, 
        user: {
            uid: updatedUser.uid,
            name: updatedUser.displayName,
            email: updatedUser.email,
            photoURL: updatedUser.photoURL,
        }
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile." };
  }
}
