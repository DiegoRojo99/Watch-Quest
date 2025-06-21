'use client'

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } 
    catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } 
      else {
        setError('An unknown error occurred');
      }
    }
  }

  return (
    <div className="min-h-screen mx-auto py-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to Watch Quest</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleGoogleSignIn}
        className="w-full bg-[var(--color-accent)] text-white p-2 rounded font-semibold cursor-pointer hover:bg-[var(--color-highlight)] transition-colors"
      >
        Sign In with Google
      </button>
    </div>
  )
}