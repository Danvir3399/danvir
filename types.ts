
export interface Track {
  id: string;
  title: string;
  audioUrl: string;
  duration: string;
}

export interface Release {
  id: string;
  title: string;
  year: string;
  coverUrl: string;
  type: 'Album' | 'EP' | 'Single';
  description: string;
  links: {
    spotify?: string;
    appleMusic?: string;
    yandexMusic?: string;
    soundcloud?: string;
    youtubeMusic?: string;
  };
  tracks: Track[];
  isUpcoming?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
