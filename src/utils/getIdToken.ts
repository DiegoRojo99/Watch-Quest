import { getAuth } from "firebase/auth";

export async function getIdToken(): Promise<string | null> {
  const user = getAuth().currentUser;
  return user ? await user.getIdToken() : null;
}