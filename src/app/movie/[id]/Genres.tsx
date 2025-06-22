export function Genres({ genres }: { genres: { id: number; name: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <li key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
          {genre.name}
        </li>
      ))}
    </ul>
  )
}