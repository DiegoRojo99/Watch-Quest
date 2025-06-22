'use client';
import { useAuth } from "@/hooks/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";

export function LoginLogout() {
  const { user, userLoading } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } 
    catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!userLoading && user) {
    return (
      <button
        onClick={handleLogout}
        className="px-4 py-1.5 bg-black text-white rounded-xl hover:bg-gray-800 transition"
      >
        Log Out
      </button>
    );
  }

  return (
    <Link href="/login" className="px-4 py-1.5 bg-black text-white rounded-xl hover:bg-gray-800 transition">
      Log In
    </Link>
  );
}