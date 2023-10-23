"use client"

import React, { useEffect, useState } from 'react';
import { animeApi } from '@/app/api/anime-api';
import { Anime } from '@/types/anime';
import AnimeCard from '@/components/anime/card';
import { Skeleton } from "@/components/ui/skeleton"; 
import AnimePagination from '@/components/anime/pagination';

interface AnimePageProps {
  label: string;
  apiEndpoint: string;
  genre?: string;
}

export default function AnimePage({ label, apiEndpoint, genre }: AnimePageProps) {
  const [animes, setAnimes] = useState<Anime[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimes = async () => {
      setIsLoading(true);
    
      try {
        let response;
        if (apiEndpoint !== 'getByGenre') {
          response = await animeApi[apiEndpoint]({ perPage: 30, page: currentPage });
        } else {
          if (genre) {
            response = await animeApi[apiEndpoint](genre, { perPage: 30, page: currentPage });
          } else {
            console.error(`Error fetching ${label} anime data.`);
            return;
          }
        }

        setAnimes(response.results);
        setHasNextPage(response.hasNextPage);
      } catch (error) {
        console.error(`Error fetching ${label} anime data:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimes();
  }, [currentPage, apiEndpoint, label, genre]);
  
  return (
    <div>
      <section className="container grid items-center gap-4 md:py-2">
        <h3 className="mt-2 scroll-m-20 text-2xl font-semibold tracking-tight text-primary dark:text-primary">
          <span className="flex items-center text-primary">
            {label}
            <code className="relative ml-2 rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary">
              #{currentPage}
            </code>
          </span>
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
      </section>
      <AnimePagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={30} />
    </div>
  );
}