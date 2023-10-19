import { useEffect, useState } from 'react';
import { fetchWatchlist, removeFromWatchlist } from '@/app/api/user';
import AnimeCard from '../anime/card';
import { animeApi } from '@/app/api/anime-api';
import { Icons } from '../icons';
import { useToast } from "@/components/ui/use-toast"

interface Props {
  userId: string;
}

export default function WatchlistPage({ userId }: Props) {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast()

  useEffect(() => {
    const getWatchlist = async () => {
      const userWatchlist = await fetchWatchlist(userId);
      const animeInfoPromise = userWatchlist.map((item: any) => animeApi.getInfo(item.animeId));
      const animeInfo = await Promise.all(animeInfoPromise);
      setWatchlist(animeInfo);
      setIsLoading(false);
    };

    getWatchlist();
  }, [userId]);

  const handleRemoveFromWatchlist = async (animeId: string) => {
    await removeFromWatchlist(userId, animeId);
    setWatchlist(watchlist.filter((anime) => anime.id !== animeId));
  };

  return (
    <div className="m-4 h-[100vh]">
      <h3 className="dark-text-primary my-3 scroll-m-20 text-2xl font-semibold tracking-tight text-primary">
        Watchlist
      </h3>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
        </div>
      ) : watchlist.length === 0 ? (
        <div className="flex h-screen items-center justify-center">
          Empty.
        </div>
      ) : (
        <div className="m-0 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {watchlist.map((anime, index) => (
          <div key={index} className="relative" style={{ display: 'flex', flexDirection: 'column' }}>
            <AnimeCard anime={anime} />
            <div
              style={{ margin: 'auto', cursor: 'pointer' }}
              onClick={() => handleRemoveFromWatchlist(anime.id).then(() => toast({ title: "Removed from Watchlist!" }))}
            >
              <Icons.x className="absolute left-1 top-2 h-4 w-4 rounded-xl bg-primary text-secondary hover:bg-secondary hover:text-primary" />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}