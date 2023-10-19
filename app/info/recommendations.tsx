import React from 'react';
import { Anime } from '@/types/anime';
import AnimeCard from '@/components/anime/card';

interface Props {
  recommendations: Anime[];
}

export default function RecommendationsSection({ recommendations }: Props) {

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="my-2 scroll-m-20 text-center text-2xl font-semibold tracking-tight text-primary">
        You may also like:
      </h3>
      <div className="m-0 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {recommendations.map((recommendation, index) => (
          <AnimeCard
            key={index}
            anime={recommendation}
          />
        ))}
      </div>
    </div>
  );
}
