import React, { useEffect, useState } from 'react';
import { animeApi } from '@/app/api/anime-api';
import AnimeInfo from '@/app/info/[id]/page';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTrigger 
} from '../ui/dialog';

export default function RandomAnime() {
  const [randomAnimeId, setRandomAnimeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRandomAnime = async () => {
    setIsLoading(true);
    try {
      const response = await animeApi.getRandom();
      if (response.id) {
        setRandomAnimeId(response.id);
      } else {
        console.error('Random anime ID not found in the response.');
      }
    } catch (error) {
      console.error('Error fetching random anime:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger onClick={fetchRandomAnime}>
        <p className="flex items-center text-sm font-medium text-muted-foreground">Random</p>
      </DialogTrigger>
      <DialogContent className={"mt-2 max-h-screen overflow-y-scroll p-0 lg:max-w-screen-lg"}>
        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
          </div>
        ) : randomAnimeId ? (
          <>
            <DialogHeader />
            <AnimeInfo params={{
                id: randomAnimeId.toString()
            }} />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}