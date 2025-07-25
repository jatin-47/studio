
"use server";

import { users } from "@/lib/data";
import { User } from "@/lib/types";

export async function checkUser(email: string) {
  try {
    const user = users.find((u) => u.email === email);

    if (user) {
      return { exists: true };
    } else {
      return { exists: false, error: "You cannot login, contact the admin." };
    }
  } catch (error) {
    console.error(error);
    return { exists: false, error: "An unexpected error occurred." };
  }
}

export async function login(email: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = users.find((u) => u.email === email);

    if (user) {
      // In a real app, you would also verify the OTP here.
      // We are simulating a successful login if the email exists.
      return { success: true, user };
    } else {
      // This case should ideally not be hit if checkUser is called first,
      // but is kept for robustness.
      return { success: false, error: "Invalid email." };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
