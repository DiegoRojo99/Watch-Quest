import { adminAuth } from "./firebase-admin";
import { headers } from "next/headers";

export async function getUserFromRequest(): Promise<{ uid: string }> {
  const headerStore = await headers();
  const authHeader = headerStore.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Missing or invalid Authorization header");
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid };
  } 
  catch (error) {
    throw new Error("Unauthorized: Invalid or expired token");
  }
}
