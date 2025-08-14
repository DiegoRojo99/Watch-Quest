'use client';
import { useAuth } from "@/hooks/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, userLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading]);

  if (!user) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.displayName}</h1>
      <p className="mt-4">Here you can manage your movie diary.</p>
      <Link href="/diary" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Go to Diary
      </Link>
      <Link href="/watched-movies" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Go to Watched Movies
      </Link>
      {/* <Link href="/lists" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Go to Lists
      </Link> */}
      <button className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
