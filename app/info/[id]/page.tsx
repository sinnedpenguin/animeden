"use client"

import React, { useEffect, useState } from 'react';
import { animeApi } from '@/app/api/anime-api';
import { Anime, Episode } from '@/types/anime';
import { Badge } from '@/components/ui/badge'; 
import RecommendationsSection from '../recommendations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Episodes } from '../episodes';
import VideoPlayer from '../videoplayer'; 
import { options } from '@/config/videoplayer';
import { Quality } from '@/types/videoplayer';
import { Icons } from '@/components/icons';
import WatchlistButton from '../watchlist-button';
import { auth } from '@/lib/firebase';
import { SupportAlert } from '@/components/support-alert';

interface Props {
  params: { id: string };
}

export default function AnimeInfo({ params }: Props) {
  const id = params.id;
  const [animeInfo, setAnimeInfo] = useState<Anime | null>(null);
  const [selectedEpisodeUrl, setSelectedEpisodeUrl] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [qualityOptions, setQualityOptions] = useState<Quality[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  
  const videoUrl = selectedEpisodeUrl || '';
  const userId = auth.currentUser?.uid || '';

  useEffect(() => {
    const fetchAnimeInfo = async () => {

    try {
      const response = await animeApi.getInfo(id);
      setAnimeInfo(response);
    } catch (error) {
      console.error('Error fetching anime info.', error);
    }
  };

    fetchAnimeInfo();
  }, [id]);

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
    <div className="container grid items-center gap-4 pb-8 pt-6 md:py-2">
      <SupportAlert />
      <Episodes 
        episodes={animeInfo?.episodes || []} 
        userId={userId}  
        animeId={id}  
        onSelectEpisode={(episodeUrl, qualityOptions, episodeId, episodeTitle) => {
        setSelectedEpisodeUrl(episodeUrl);
        setQualityOptions(qualityOptions);
        setSelectedEpisode({ id: episodeId, title: episodeTitle, sources: [] });
      }} 
      />
      {selectedEpisodeUrl ? (
        <VideoPlayer
          options={{
            ...options,
            url: videoUrl,
            poster: animeInfo?.cover,
          }}
          qualityOptions={qualityOptions} 
          animeId={animeInfo?.id || ''}
          animeTitle={animeInfo?.title.english || animeInfo?.title.native || animeInfo?.title.romaji || ''}
          episodeId={selectedEpisode?.id || ''} 
          episodeTitle={selectedEpisode?.title || ''}  
          currentTime={currentTime}
        />
      ) : (
        <div className="sm:h-30 flex h-20 w-full items-center justify-center rounded bg-black text-white md:h-[50vh] lg:h-[50vh] xl:h-[55vh]">
          {!animeInfo ? (
            <div className="flex h-screen items-center justify-center">
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </div>
          ) : (
            <p className="[&:not(:first-child)] leading-7">
              Select an episode to watch!
            </p>
          )}
        </div>
      )}
      {animeInfo && userId && 
        <WatchlistButton 
          userId={userId} 
          animeId={animeInfo?.id || ''} 
          animeTitle={animeInfo?.title.english || animeInfo?.title.native || animeInfo?.title.romaji || ''} 
        />
      }
      {!animeInfo ? (
        <div className="flex h-screen items-center justify-center">
        </div>
      ) : (
        <div className="flex flex-col items-center md:mr-0 md:flex-row">
          <div className="text-left md:w-5/6">
            <Badge className="mb-1 mr-1 text-xs" variant="secondary">
              {animeInfo.type}
            </Badge>
            <Badge className="mb-1 text-xs">
              {animeInfo.rating}/100
            </Badge>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
              {animeInfo.title.english || animeInfo.title.native || animeInfo.title.romaji}
            </h1>
            <ScrollArea className="mt-4 h-[275px] pb-4 pr-4">
              <div dangerouslySetInnerHTML={{ __html: formatDescription(animeInfo.description) }} />
            </ScrollArea>
            <p className="[&:not(:first-child)] leading-7">
              <span className="text-primary">Genres: </span> {animeInfo.genres.join(', ')}
            </p>
            <p className="[&:not(:first-child)] leading-7">
              <span className="text-primary">Release Date: </span> {animeInfo.releaseDate}
            </p>
            <p className="[&:not(:first-child)] leading-7">
              <span className="text-primary">Status: </span> {animeInfo.status}
            </p>
            <p className="[&:not(:first-child)] leading-7">
              <span className="text-primary">Total Episodes: </span>  {animeInfo.totalEpisodes}
            </p>
          </div>
        </div>
      )}
      {animeInfo?.recommendations && (
        <div className="mt-6">
          <RecommendationsSection recommendations={animeInfo?.recommendations} />
        </div>
      )}
    </div>
  );
}