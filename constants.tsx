
import { Release, SocialLink } from './types';

export const DICT = {
  en: {
    music: 'Music',
    contact: 'Contact',
    heroSub: 'Electronic Producer',
    discography: 'Discography',
    selectedWorks: 'SELECTED WORKS',
    genres: 'Breakbeat / Big Beat / Trip-Hop',
    tracklist: 'Tracklist',
    getInTouch: 'GET IN\nTOUCH',
    contactText: 'For bookings, remixes, or collaboration inquiries, please reach out via email or follow through social channels.',
    follow: 'Follow the static',
    rights: 'ALL RIGHTS RESERVED.',
    terms: 'Terms',
    privacy: 'Privacy',
    loading: 'Loading...',
    error: 'Playback Error'
  },
  ru: {
    music: 'Музыка',
    contact: 'Контакт',
    heroSub: 'Электронный продюсер',
    discography: 'Дискография',
    selectedWorks: 'ИЗБРАННЫЕ РАБОТЫ',
    genres: 'Брейкбит / Биг-бит / Трип-хоп',
    tracklist: 'Треклист',
    getInTouch: 'СВЯЗАТЬСЯ\nС НАМИ',
    contactText: 'По вопросам букинга, ремиксов или коллабораций пишите на почту или подписывайтесь в соцсетях.',
    follow: 'Следите за эфиром',
    rights: 'ВСЕ ПРАВА ЗАЩИЩЕНЫ.',
    terms: 'Условия',
    privacy: 'Приватность',
    loading: 'Загрузка...',
    error: 'Ошибка загрузки'
  }
};

// Using high-availability Google-hosted samples for maximum compatibility
export const RELEASES: (lang: 'en' | 'ru') => Release[] = (lang) => [];

export const SOCIALS: SocialLink[] = [
  { platform: 'Spotify', url: 'https://open.spotify.com/artist/5GElDhoDb2YoebamMS56wc', icon: 'fa-brands fa-spotify' },
  { platform: 'Apple Music', url: 'https://music.apple.com/us/artist/danvir/1849599425', icon: 'fa-brands fa-apple' },
  { platform: 'Yandex Music', url: 'https://music.yandex.ru/artist/25334390', icon: 'yandex-music' },
  { platform: 'Instagram', url: 'https://www.instagram.com/DANVIR_music', icon: 'fa-brands fa-instagram' },
  { platform: 'TikTok', url: 'https://www.tiktok.com/@danvir_music', icon: 'fa-brands fa-tiktok' }
];

export const CONTACT_EMAIL = 'info@danvir.ru';
