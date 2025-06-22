"use client";

import { WatchedMovieInput } from "@/types/WatchedMovie";
import { getIdToken } from "@/utils/getIdToken";
import { useState } from "react";

interface WatchedMovieModalProps {
  movieId: number;
  title: string;
  posterPath: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WatchedMovieModal({
  movieId,
  title,
  onClose,
  onSuccess,
}: WatchedMovieModalProps) {
  const [dateWatched, setDateWatched] = useState<string>("");
  const [platform, setPlatform] = useState<string>("Netflix");
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await getIdToken();
      if (!token) throw new Error("Unauthorized: No valid token found");

      const parsedData: WatchedMovieInput = {
        movieId,
        watchedDate: dateWatched || null,
        method: platform === "Cinema" ? "Cinema" : "Platform",
        platform: platform !== "Cinema" ? platform : null,
        rating,
        notes,
      };

      const res = await fetch("/api/watched-movies", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(parsedData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add watched movie");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-50">
      <form className="bg-gray-900 rounded p-6 max-w-md w-full space-y-4 shadow-lg mx-2" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold">Add {title} to watched</h2>

        <label className="block">
          Date watched (optional)
          <input
            type="date"
            value={dateWatched}
            onChange={(e) => setDateWatched(e.target.value)}
            className="w-full rounded p-2 bg-gray-800 border border-gray-700"
          />
        </label>

        <label className="block">
          Platform
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full rounded p-2 bg-gray-800 border border-gray-700"
          >
            <option value="Netflix">Netflix</option>
            <option value="Amazon Prime">Amazon Prime</option>
            <option value="Hulu">Hulu</option>
            <option value="Cinema">Cinema</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="block">
          Rating
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
            className="w-full rounded p-2 bg-gray-800 border border-gray-700"
          />
        </label>

        <label className="block">
          Notes (optional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded p-2 bg-gray-800 border border-gray-700"
            rows={3}
          />
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
