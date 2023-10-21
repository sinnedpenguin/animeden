import React, { useEffect, useState } from 'react';
import { animeApi } from '@/app/api/anime-api';
import { Anime } from '@/types/anime';
import AnimeCard from '@/components/anime/card';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  label: string;
  apiEndpoint: string;
  seeMoreLink: string; 
}

export function AnimeSection({ label, apiEndpoint, seeMoreLink }: Props) {
  const [animes, setAnimes] = useState<Anime[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await animeApi[apiEndpoint]({ perPage: 30 });
        const shuffled = response.results.sort(() => 0.5 - Math.random());
        setAnimes(shuffled);
        setIsLoading(false);
      } catch (error) {
        console.error(`Error fetching ${label} anime data:`, error);
        setIsLoading(false);
      }
    };
  
    fetchAnimes();
  }, [label, apiEndpoint]); 

  return (
    <section className="container grid items-center gap-2 md:py-2">
      <h3 className="my-2 scroll-m-20 text-2xl font-semibold tracking-tight text-primary dark:text-primary">
        {label}
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 30 }, (_, index) => (
            <div key={index}>
              <Skeleton className="h-48 w-full rounded-sm sm:h-80" />
            </div>
          ))
        ) : (
          animes &&
          animes.map((anime, index) => (
            <AnimeCard
              key={index}
              anime={anime}
            />
          ))
        )}
      </div>
      <div className="mb-6 mt-2 text-center">
        <Link href={seeMoreLink}>
          <code
            className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary transition-colors duration-300 hover:bg-primary hover:text-white"
          >
            See more
          </code>
        </Link>
      </div>
    </section>
  );
}
