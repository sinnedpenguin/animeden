import { useEffect, useState } from 'react';
import { fetchContinueWatching, removeFromContinueWatching } from '../api/user';
import AnimeCard from '@/components/anime/card';
import { animeApi } from '../api/anime-api';
import { Icons } from '@/components/icons';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  userId: string;
}

export default function ContinueWatching({ userId }: Props) {
  const [continueWatching, setContinueWatching] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getContinueWatching = async () => {
      const userContinueWatching = await fetchContinueWatching(userId);
      const animeInfoPromise = userContinueWatching.map((item: any) => animeApi.getInfo(item.animeId));
      const animeInfo = await Promise.all(animeInfoPromise);
      setContinueWatching(animeInfo);
      setIsLoading(false);
    };
    getContinueWatching();
  }, [userId]);

  const handleRemoveFromContinueWatching = async (animeId: string) => {
    await removeFromContinueWatching(userId, animeId);
    if (continueWatching) {
      setContinueWatching(continueWatching.filter((anime) => anime.id !== animeId));
    } 
  };

  if (!continueWatching || continueWatching.length === 0) {
    return null;
  }

  return (
    <section className="container mb-4 grid items-center gap-2 md:py-2">
      <h3 className="my-2 scroll-m-20 text-2xl font-semibold tracking-tight text-primary dark:text-primary">
        Continue <span className="text-black dark:text-white">Watching</span>
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {continueWatching.map((anime, index) => (
          <div key={index} className="relative" style={{ display: 'flex', flexDirection: 'column' }}>
            <AnimeCard key={index} anime={anime} />
            <div
              style={{ margin: 'auto', cursor: 'pointer' }}
              onClick={() => handleRemoveFromContinueWatching(anime.id).then(() => toast({ title: "Removed from Continue Watching!" }))}
            >
              <Icons.x className="absolute left-1 top-2 h-4 w-4 rounded-xl bg-primary text-secondary hover:bg-secondary hover:text-primary" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
