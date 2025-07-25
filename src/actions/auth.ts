"use server";

import { users } from "@/lib/data";

export async function login(credentials: { mobileNumber: string; password: string }) {
  try {
    const user = users.find(
      (u) => u.mobileNumber === credentials.mobileNumber && u.password === credentials.password
    );

    if (user && user.role === 'admin') {
      // In a real app, you would create a session here
      return { success: true };
    } else {
      return { success: false, error: "Invalid mobile number or password, or you are not an admin." };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
