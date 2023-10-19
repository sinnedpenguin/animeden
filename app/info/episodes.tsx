import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Episode, Source } from '@/types/anime';
import { animeApi } from '@/app/api/anime-api';
import { Quality } from '@/types/videoplayer';
import { loadContinueWatching } from '../api/user';

interface EpisodesProps {
  episodes: Episode[];
  onSelectEpisode: (episodeUrl: string, qualityOptions: Quality[], episodeId: string, episodeTitle: string ) => void;
  userId: string;  
  animeId: string;  
}

export function Episodes({ episodes, onSelectEpisode, userId, animeId }: EpisodesProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const hasFetchedEpisodeRef = useRef(false);

  const handleEpisodeSelect = useCallback(async (episode: Episode, episodeNumber: number) => {
    const episodeTitle = episode.title || '';
    setValue(`${episodeNumber}. ${episodeTitle}`);
    setSelectedEpisode(episode);
    setOpen(false);
  
    try {
      const response = await animeApi.getEpisode(episode.id);
      const sources: Source[] = response.sources.map((source: any) => {
        const quality: Quality = {
          default: source.index === 0,
          html: source.quality,
          url: source.url,
        };
        return quality;
      });
  
      const url = sources[0].url;
      
      onSelectEpisode(url, sources, episode.id, episodeTitle);
    } catch (error) {
      console.error('Error fetching episode url:', error);
    }
  }, [onSelectEpisode]);

  useEffect(() => {
    const fetchSavedEpisode = async () => {
      const continueWatchingData = await loadContinueWatching(userId, animeId);
      if (continueWatchingData) {
        const savedEpisode = episodes.find(ep => ep.id === continueWatchingData.episodeId);
        if (savedEpisode) {
          const episodeNumber = episodes.findIndex(ep => ep.id === savedEpisode.id) + 1;
          handleEpisodeSelect(savedEpisode, episodeNumber);
          hasFetchedEpisodeRef.current = true;
        }
      }
    };
  
    if (episodes.length > 0 && !hasFetchedEpisodeRef.current) {
      fetchSavedEpisode();
    }
  }, [episodes, animeId, handleEpisodeSelect, userId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="mt-4 w-full justify-between"
        >
          {value ? value : 'Episodes'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[450px] w-[40vh] overflow-y-auto p-0">
        <Command>
          <CommandInput placeholder="Search an episode..." />
          <CommandEmpty>No episode found.</CommandEmpty>
          <CommandGroup>
            {episodes.map((ep, index) => (
              <CommandItem
                key={ep.id}
                onSelect={() => handleEpisodeSelect(ep, index + 1)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === `${index + 1}. ${ep.title || ''}` ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {index + 1}. {ep.title || ''}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
