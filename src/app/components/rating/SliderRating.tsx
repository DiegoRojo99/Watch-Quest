'use client';
import { useState } from "react";

export function SliderRating({ initial = 7.0, onChange }: { initial?: number; onChange: (value: number) => void }) {
  const [value, setValue] = useState(initial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="rating" className="text-sm font-medium text-white">Your Rating: {value.toFixed(1)} / 10</label>
      <input
        id="rating"
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={value}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}
