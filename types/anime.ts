export type Anime = {
  id: string;
  image: string;
  title: Title;
  rating: string;
  episodes: Episode[];
  totalEpisodes: number;
  sources: Source[],
  cover: string;
  description: string;
  genres: string[];
  releaseDate: string;
  status: string;
  recommendations: Recommendations[];
  type: string;
};

export type Title = {
  english: string;
  romaji: string;
  native: string;
};

export type Episode = {
  sources: Source[];
  id: string;
  title: string;
}

export type Recommendations = Anime & {
};

export type Source = {
  html: string;
  default: boolean;
  quality: string;
  url: string;
};