"use client";
import { Platform } from "@/types/WatchedMovie";
import { platformLogos } from "@/data/platforms";
import Image from "next/image";

interface PlatformSelectorProps {
  platform: Platform;
  setPlatform: (p: Platform) => void;
  showSelector: boolean;
}

export default function PlatformSelector({ platform, setPlatform, showSelector }: PlatformSelectorProps) {
  if (!showSelector) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
      {(Object.keys(platformLogos) as Platform[]).map((p) => (
        <button
          key={p}
          type="button"
          aria-label={`Select platform ${p}`}
          onClick={() => setPlatform(p)}
          className={`w-24 mx-auto border-2 rounded-xl transition overflow-hidden ${
            platform === p ? "border-blue-500 bg-gray-800" : "border-gray-700"
          }`}
        >
          <Image
            src={platformLogos[p] ?? "/platforms/other.png"}
            alt={p}
            width={128}
            height={128}
            className="object-contain w-24 h-auto my-auto rounded-xl"
          />
        </button>
      ))}
    </div>
  );
}
