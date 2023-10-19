import React, { FC, useEffect, useRef, useState } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { Options, Quality } from '@/types/videoplayer';
import { addToContinueWatching, loadContinueWatching } from '../api/user';
import { getAuth } from 'firebase/auth';

interface Props {
  options: Options;
  qualityOptions: Quality[];
  animeId: string;
  animeTitle: string;
  episodeId: string;
  episodeTitle: string;
  currentTime: number;
}

const VideoPlayer: FC<Props> = ({ options, qualityOptions, animeId, animeTitle, episodeId, episodeTitle, currentTime }) => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const artRef = useRef<Artplayer | null>(null);
  const [savedTime, setSavedTime] = useState<number>(0);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      loadContinueWatching(userId, animeId).then((continueWatchingData) => {
        if (continueWatchingData) {
          setSavedTime(continueWatchingData.currentTime);
        }
      });
    }
  }, [user, animeId]);

  useEffect(() => {
    if (playerRef.current) {
      artRef.current?.destroy(false);
      
      const art = new Artplayer({
        ...options,
        container: playerRef.current,
        customType: {
          m3u8: playM3u8,
        },
        settings: [
          {
            html: 'Quality',
            selector: qualityOptions.map((qualityOption) => ({
              default: qualityOption.default,
              html: qualityOption.html,
              url: qualityOption.url,
            })),
            onSelect: (item) => {
              const qualityOption = qualityOptions.find((q) => q.html === item.html);
              if (qualityOption) {
                artRef.current?.switchQuality(item.url);
                artRef.current?.storage.set('quality', item.html);
                return item.html;
              }
            },
          },
        ],
      });

      artRef.current = art; 

      const savedQuality = artRef.current?.storage.get('quality');
      if (savedQuality) {
        const selectedQualityOption = qualityOptions.find((q) => q.html === savedQuality);
        if (selectedQualityOption) {
          artRef.current?.switchQuality(selectedQualityOption.url);
        }
      }

      artRef.current?.on('destroy', () => {
        if (user) {
          const userId = user.uid;
          const currentTime = artRef.current?.video.currentTime || 0;
          const savedQuality = artRef.current?.storage.get('quality');
          const selectedQualityOption = qualityOptions.find((q) => q.html === savedQuality);
          if (selectedQualityOption) {
            addToContinueWatching(userId, animeId, animeTitle, episodeId, episodeTitle, selectedQualityOption.url, currentTime);
          }
        }
      });

      artRef.current?.on('ready', () => {
        setTimeout(() => {
          if (artRef.current) {
            artRef.current.video.currentTime = savedTime;
          }
        }, 1000); 
      });

      return () => {
        artRef.current?.destroy(false);
      };
    }
  }, [options, qualityOptions, user, savedTime, animeId, animeTitle, episodeId, episodeTitle]);

  function playM3u8(video: HTMLVideoElement, url: string, art: Artplayer) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.on('destroy', () => hls.destroy());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else {
      art.notice.show = 'Unsupported playback format: m3u8';
    }
  }

  return (
    <div className="h-60 sm:h-auto md:h-[35vh] lg:h-[45vh] xl:h-[55vh]" ref={playerRef} />
  );
};

export default VideoPlayer;