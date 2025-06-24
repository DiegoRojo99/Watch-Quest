"use client";

import { Platform, WatchedMovieInput } from "@/types/WatchedMovie";
import { getIdToken } from "@/utils/getIdToken";
import { useState } from "react";
import { SliderRating } from "../rating/SliderRating";
import PlatformSelector from "../PlatformSelector";

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
  const [method, setMethod] = useState<'Cinema' | 'Streaming Platform' | 'Other'>("Cinema");
  const [platform, setPlatform] = useState<Platform>("Netflix");
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
      if (!movieId) throw new Error("Movie ID is required");
      if (!['Cinema', 'Streaming Platform', 'Other'].includes(method)) throw new Error("Watch method is required");

      const parsedData: WatchedMovieInput = {
        movieId,
        watchedDate: dateWatched || null,
        method: method,
        platform: method !== "Cinema" ? platform : null,
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
      <form className="bg-gray-900 rounded p-6 max-w-xl w-full space-y-4 shadow-lg mx-2 
      max-h-[85vh] overflow-y-auto" onSubmit={handleSubmit}>
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
          Method
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'Cinema' | 'Streaming Platform' | 'Other')}
            className="w-full rounded p-2 bg-gray-800 border border-gray-700"
          >
            <option value="Cinema">Cinema</option>
            <option value="Streaming Platform">Streaming Platform</option>
            <option value="Other">Other</option>
          </select>
        </label>

        { method === "Streaming Platform" && (
          <label className="block">
            Platform
              <PlatformSelector
                platform={platform}
                setPlatform={setPlatform}
                showSelector={method === "Streaming Platform"}
              />
          </label>
        )}

        <label className="block">
          Rating
          <SliderRating initial={rating} onChange={setRating} />
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
