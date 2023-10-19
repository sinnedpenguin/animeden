import { useEffect, useState } from 'react';
import { animeApi } from '@/app/api/anime-api';
import { Anime } from '@/types/anime';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTrigger 
} from '@/components/ui/dialog';
import AnimeInfo from '../info/[id]/page';

export default function HeroSection() {
  const [hero, setHero] = useState<Anime[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularAnimes = async () => {
      try {
        const response = await animeApi.getTrending({ perPage: 5 });
        setHero(response.results);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchPopularAnimes();
  }, []);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  if (isLoading) {
    return (
      <section className="container my-6 grid items-center">
        <Skeleton className="h-[25vh] w-full rounded-md md:h-[50vh] lg:h-[50vh]" />
      </section>
    )
  }

  function formatDescription(description: string) {
    if (!description) {
      return ""; 
    }
  
    const formattedDescription = description
      .replace(/<br>/g, '<br/>')
      .replace(/<b>/g, '<b>')
      .replace(/<\/b>/g, '</b>')
      .replace(/<i>/g, '<i>');
  
    return formattedDescription;
  }

  return (
    <section className="container my-6 grid items-center">
      <Carousel 
        responsive={responsive} 
        infinite={true} 
        autoPlay={true} 
        showDots={true}
        draggable={false}
        arrows={false}
        autoPlaySpeed={8000}
      >
        {hero?.map((anime: Anime, index: number) => (
        <div key={index} className="relative">
          <div
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${anime.cover})`,
            }}
            className="h-[50vh] w-full rounded-md bg-cover bg-center"
          >
            {(anime.title.english || anime.title.native || anime.title.romaji) && (
              <div className="absolute left-0 top-0 mx-auto flex h-full max-w-full flex-col rounded-md px-4 md:max-w-[80%] md:justify-center md:px-12">
                <h1 className="mt-2 text-lg font-extrabold tracking-tight text-white md:text-2xl lg:text-2xl">
                  <div>
                    <Badge variant="secondary" className="mb-2 mr-1">
                      {anime.type}
                    </Badge>
                    <Badge>
                      {anime.rating}/100
                    </Badge>
                  </div>
                  {anime.title.english || anime.title.native || anime.title.romaji}
                </h1>
                <div className="mt-2 line-clamp-6 overflow-hidden text-ellipsis text-sm text-white">
                <div dangerouslySetInnerHTML={{ __html: formatDescription(anime.description) }} />
              </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="mt-4 w-[110px]"
                    >
                      Watch now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={"mt-2 max-h-screen overflow-y-scroll p-0 lg:max-w-screen-lg"}>
                  <DialogHeader>
                  </DialogHeader>
                  <AnimeInfo params={{
                    id: anime.id
                  }} />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
        ))}
      </Carousel>
    </section>
  );
}
