import { AnimeSection } from "@/components/anime/section";

export function TrendingSection() {
  return (
    <AnimeSection label="Trending" apiEndpoint="getTrending" seeMoreLink="/trending" />
  );
}

export function PopularSection() {
  return (
    <AnimeSection label="Popular" apiEndpoint="getPopular" seeMoreLink="/popular" />
  );
}