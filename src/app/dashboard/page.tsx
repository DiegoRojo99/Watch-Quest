'use client';
import { useAuth } from "@/hooks/AuthProvider";
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
    </div>
  );
}
