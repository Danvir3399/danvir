
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
export const RELEASES: (lang: 'en' | 'ru') => Release[] = (lang) => [
  {
    id: 'concrete-echoes',
    title: 'Concrete Echoes',
    year: '2024',
    type: 'Album',
    coverUrl: 'https://picsum.photos/id/111/800/800?grayscale',
    description: lang === 'en'
      ? 'A deep dive into industrial breakbeat and atmospheric trip-hop textures.'
      : 'Глубокое погружение в индустриальный брейкбит и атмосферные текстуры трип-хопа.',
    tracks: [
      { id: 't1', title: 'Urban Deceleration', duration: '0:34', audioUrl: 'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3' },
      { id: 't2', title: 'Rusty Circuits', duration: '0:25', audioUrl: 'https://storage.googleapis.com/media-session/big-buck-bunny/prelude.mp3' },
      { id: 't3', title: 'Midnight Grid', duration: '0:27', audioUrl: 'https://storage.googleapis.com/media-session/sintel/snow-fight.mp3' }
    ],
    links: {
      spotify: '#',
      yandexMusic: '#',
      soundcloud: '#'
    }
  },
  {
    id: 'static-pulse',
    title: 'Static Pulse',
    year: '2023',
    type: 'EP',
    coverUrl: 'https://picsum.photos/id/222/800/800?grayscale',
    description: lang === 'en'
      ? 'High-energy big beat influenced by the UK scene of the late 90s.'
      : 'Энергичный биг-бит под влиянием британской сцены конца 90-х.',
    tracks: [
      { id: 't4', title: 'Overload', duration: '0:50', audioUrl: 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Samples/master/sample.mp3' },
      { id: 't5', title: 'Break the Loop', duration: '0:15', audioUrl: 'https://www.w3schools.com/html/horse.mp3' }
    ],
    links: {
      spotify: '#',
      appleMusic: '#',
      soundcloud: '#'
    }
  },
  {
    id: 'low-fidelity',
    title: 'Low Fidelity Rituals',
    year: '2022',
    type: 'Single',
    coverUrl: 'https://picsum.photos/id/333/800/800?grayscale',
    description: lang === 'en'
      ? 'Experimental trip-hop with heavy sampling and dusty vinyl aesthetic.'
      : 'Экспериментальный трип-хоп с глубоким семплированием и эстетикой пыльного винила.',
    tracks: [
      { id: 't6', title: 'Dusty Grooves', duration: '0:34', audioUrl: 'https://archive.org/download/testmp3testfile/mpthreetest.mp3' }
    ],
    links: {
      yandexMusic: '#',
      soundcloud: '#'
    }
  }
];

export const SOCIALS: SocialLink[] = [
  { platform: 'Spotify', url: 'https://open.spotify.com/artist/5GElDhoDb2YoebamMS56wc', icon: 'fa-brands fa-spotify' },
  { platform: 'Apple Music', url: 'https://music.apple.com/us/artist/danvir/1849599425', icon: 'fa-brands fa-apple' },
  { platform: 'Yandex Music', url: 'https://music.yandex.ru', icon: 'yandex-music' }
];

export const CONTACT_EMAIL = 'info@danvir.ru';
