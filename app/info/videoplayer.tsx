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

      art.controls.add({
        name: 'backward',
        position: 'right',
        html: '<svg viewBox="0 0 24 24" fill="none" width="21" height="21"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.02 2.048A10 10 0 1 1 2 12H0a12 12 0 1 0 5-9.747V1H3v4a1 1 0 0 0 1 1h4V4H6a10 10 0 0 1 5.02-1.952ZM2 4v3h3v2H1a1 1 0 0 1-1-1V4h2Zm12.125 12c-.578 0-1.086-.141-1.523-.424-.43-.29-.764-.694-.999-1.215-.235-.527-.353-1.148-.353-1.861 0-.707.118-1.324.353-1.851.236-.527.568-.932.999-1.215.437-.29.945-.434 1.523-.434s1.083.145 1.513.434c.437.283.774.688 1.009 1.215.235.527.353 1.144.353 1.851 0 .713-.118 1.334-.353 1.86-.235.522-.572.927-1.009 1.216-.43.283-.935.424-1.513.424Zm0-1.35c.39 0 .696-.186.918-.56.222-.378.333-.909.333-1.59s-.111-1.208-.333-1.581c-.222-.38-.528-.57-.918-.57s-.696.19-.918.57c-.222.373-.333.9-.333 1.581 0 .681.111 1.212.333 1.59.222.374.528.56.918.56Zm-5.521 1.205v-5.139L7 11.141V9.82l3.198-.8v6.835H8.604Z" fill="currentColor"></path></svg>', 
        tooltip: 'Backward 10s',
        click: function() {
          art.currentTime -= 10;
        },
      });
      
      art.controls.add({
        name: 'forward',
        position: 'right',
        html: '<svg viewBox="0 0 24 24" fill="none" width="21" height="21"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.444 3.685A10 10 0 0 1 18 4h-2v2h4a1 1 0 0 0 1-1V1h-2v1.253A12 12 0 1 0 24 12h-2A10 10 0 1 1 6.444 3.685ZM22 4v3h-3v2h4a1 1 0 0 0 1-1V4h-2Zm-9.398 11.576c.437.283.945.424 1.523.424s1.083-.141 1.513-.424c.437-.29.774-.694 1.009-1.215.235-.527.353-1.148.353-1.861 0-.707-.118-1.324-.353-1.851-.235-.527-.572-.932-1.009-1.215-.43-.29-.935-.434-1.513-.434-.578 0-1.086.145-1.523.434-.43.283-.764.688-.999 1.215-.235.527-.353 1.144-.353 1.851 0 .713.118 1.334.353 1.86.236.522.568.927.999 1.216Zm2.441-1.485c-.222.373-.528.56-.918.56s-.696-.187-.918-.56c-.222-.38-.333-.91-.333-1.591 0-.681.111-1.208.333-1.581.222-.38.528-.57.918-.57s.696.19.918.57c.222.373.333.9.333 1.581 0 .681-.111 1.212-.333 1.59Zm-6.439-3.375v5.14h1.594V9.018L7 9.82v1.321l1.604-.424Z" fill="currentColor"></path></svg>',
        tooltip: 'Forward 10s',
        click: function() {
          art.currentTime += 10;
        },
      });

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