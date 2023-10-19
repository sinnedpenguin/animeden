export type Options = {
  container: string;
  url: string;
  poster?: string;
  volume?: number;
  hotkey?: boolean;
  isLive?: boolean;
  muted?: boolean;
  autoplay?: boolean;
  pip?: boolean;
  autoOrientation?: boolean;
  autoSize?: boolean;
  autoMini?: boolean;
  setting?: boolean;
  playbackRate?: boolean;
  aspectRatio?: boolean;
  fullscreen?: boolean;
  miniProgressBar?: boolean;
  mutex?: boolean;
  backdrop?: boolean;
  playsInline?: boolean;
  autoPlayback?: boolean;
  airplay?: boolean;
  theme?: string;
  moreVideoAttr?: {
    crossOrigin?: string;
  },
};

export type Quality = {
  default: boolean;
  html: string;
  url: string;
}