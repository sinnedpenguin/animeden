import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation"

const genresList = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports", 
  "Supernatural",
  "Thriller"
];

export default function GenresList() {
  const router = useRouter();

  const handleGenreSelect = (genre: string) => {
    const decodedGenre = decodeURIComponent(genre);
    router.push(`/genre/${decodedGenre}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <p className="flex items-center text-sm font-medium text-muted-foreground">Genres</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="h-[40vh] overflow-y-auto">
        {genresList.map((genre, index) => (
          <DropdownMenuItem key={index} onClick={() => handleGenreSelect(genre)}>
            {genre}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
