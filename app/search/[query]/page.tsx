"use client"

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AnimeCard from '@/components/anime/card';
import { animeApi } from '@/app/api/anime-api';
import { Anime } from '@/types/anime';
import { Skeleton } from "@/components/ui/skeleton"; 
import AnimePagination from '@/components/anime/pagination';

export default function SearchResults() {
  const [searchResults, setSearchResults] = useState<Anime[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const pathname = usePathname();
  const query = pathname.split('/')[2];

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        setIsLoading(true);

        try {
          const response = await animeApi.search(query, currentPage);
          setSearchResults(response.results);
          setHasNextPage(response.hasNextPage);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSearchResults();
    }
  }, [pathname, currentPage, query]);

  return (
    <div>
      <section className="container grid items-center gap-4 md:py-2">
        <h3 className="mt-2 scroll-m-20 text-2xl font-semibold tracking-tight text-primary dark:text-primary">
          <span className="flex items-center text-black dark:text-white">
            Search results for:
          </span>
          <span className="flex items-center text-primary">{decodeURIComponent(query)}</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {isLoading ? (
            Array.from({ length: 30 }, (_, index) => (
              <div key={index}>
                <Skeleton className="h-48 w-full rounded-sm sm:h-80" />
              </div>
            ))
          ) : (
            searchResults &&
            searchResults.map((result, index) => (
              <AnimeCard
                key={index}
                anime={result}
              />
            ))
          )}
        </div>
      </section>
      <AnimePagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={30} />
    </div>
  );
}
