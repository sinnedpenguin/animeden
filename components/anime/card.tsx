import React, { useState } from 'react';
import Image from 'next/image'; 
import { Anime } from '@/types/anime';
import { Badge } from '@/components/ui/badge';
import { Icons } from "@/components/icons";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTrigger 
} from '../ui/dialog';
import AnimeInfo from '@/app/info/[id]/page';

interface Props {
  anime: Anime;
}

export default function AnimeCard({ anime }: Props ) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={`relative cursor-pointer rounded-md border-none shadow-md transition-transform${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            <Badge variant="secondary" className="absolute right-1 top-2">
              {anime.type}
            </Badge>
            <Badge className="absolute right-1 top-8">
              {anime.rating}/100
            </Badge>
            <Image
              width={500}
              height={500}
              src={anime.image}
              alt={anime.title.english || anime.title.native || anime.title.romaji}  
              className="w-full rounded-sm object-cover sm:h-48 md:h-48 lg:h-80"
            />
            {isHovered && (
              <Icons.play
                className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-4xl text-primary"
              />
            )}
          </div>
          <div className="px-4 py-2">
            <h3 className="truncate text-sm">
              {anime.title.english || anime.title.native || anime.title.romaji}
            </h3>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className={"mt-2 max-h-screen overflow-y-scroll p-0 lg:max-w-screen-lg"}>
        <DialogHeader />
        <AnimeInfo params={{
          id: anime.id
        }} />
      </DialogContent>
    </Dialog>
  );
}