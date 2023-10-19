import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addToWatchlist, removeFromWatchlist, checkWatchlist } from "../api/user";
import { useState, useEffect } from 'react';

interface Props {
  userId: string;
  animeId: string;
  animeTitle: string;
}

export default function WatchlistButton({ userId, animeId, animeTitle }: Props) {
  const { toast } = useToast();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserWatchlist = async () => {
      try {
        const inWatchlist = await checkWatchlist(userId, animeId);
        setIsInWatchlist(inWatchlist);
      } catch (error) {
        console.error("Error checking watchlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserWatchlist();
  }, [userId, animeId]);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(userId, animeId);
        toast({ title: "Removed from Watchlist!" });
      } else {
        await addToWatchlist(userId, animeId, animeTitle);
        toast({ title: "Added to Watchlist!" });
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button variant="secondary" onClick={handleClick} disabled={isLoading}>
        <Icons.bookmark className="mr-2 h-4 w-4" />
        {isLoading ? <><Icons.loader className="mr-2 h-4 w-4 animate-spin" /> Loading </> : isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </Button>
    </div>
  );
}