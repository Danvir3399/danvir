
import React, { useState, useMemo } from 'react';
import { RELEASES, SOCIALS, CONTACT_EMAIL, DICT } from './constants';
import { Track, SocialLink } from './types';
import MusicPlayer from './components/MusicPlayer';

const YandexMusicIconSVG = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 442 445" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M220.86 445C342.838 445 441.72 345.383 441.72 222.5C441.72 99.6166 342.838 0 220.86 0C98.8825 0 0 99.6166 0 222.5C0 345.383 98.8825 445 220.86 445ZM388.708 178.196L387.278 171.451L330.975 161.517L363.752 116.784L359.979 112.4L311.801 135.793L317.888 73.7988L312.958 70.8861L283.65 121.169L250.842 46.3274H245.06L252.881 118.532L170.161 51.5703L163.192 53.6245L226.769 134.628L100.802 92.2255L94.989 98.6641L207.595 163.571L52.3205 176.725L50.5857 186.382L211.947 204.196L77.2764 317.086L83.0893 324.966L243.294 236.665L211.673 392.234H221.26L282.767 245.74L320.232 360.348L326.897 355.074L311.527 238.719L369.839 305.681L373.613 299.518L328.936 216.491L391.326 239.884L391.904 232.863L335.905 191.043L388.708 178.196Z"
    />
  </svg>
);

const SocialIcon = ({ social, className, context }: { social: SocialLink | string, className?: string, context?: 'hero' | 'music' | 'contact' }) => {
  const icon = typeof social === 'string' ? social : social.icon;
  if (icon === 'yandex-music') {
    let style: React.CSSProperties = {};
    if (context === 'hero') style = { transform: 'scale(0.65) translateY(-20%)' };
    else if (context === 'music') style = { transform: 'translateY(20%)' };

    return <YandexMusicIconSVG className={className} style={style} />;
  }
  return <i className={`${icon} ${className}`}></i>;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ru'>('ru');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeReleaseId, setActiveReleaseId] = useState<string | null>(null);

  const t = DICT[lang];
  const releases = useMemo(() => RELEASES(lang), [lang]);

  const handlePlayTrack = (track: Track, releaseId: string) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setActiveReleaseId(releaseId);
    }
  };

  const getNextTrack = () => {
    if (!currentTrack || !activeReleaseId) return;
    const release = releases.find(r => r.id === activeReleaseId);
    if (!release) return;
    const idx = release.tracks.findIndex(t => t.id === currentTrack.id);
    if (idx < release.tracks.length - 1) {
      setCurrentTrack(release.tracks[idx + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const getPrevTrack = () => {
    if (!currentTrack || !activeReleaseId) return;
    const release = releases.find(r => r.id === activeReleaseId);
    if (!release) return;
    const idx = release.tracks.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) {
      setCurrentTrack(release.tracks[idx - 1]);
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#050505]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 p-5 md:p-10 flex justify-between items-center bg-black/80 md:bg-transparent">
        <h1 className="text-xl md:text-2xl font-heading font-bold tracking-tighter text-white">DANVIR</h1>

        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em]">
            <a href="#music" onClick={(e) => scrollToSection(e, 'music')} className="text-white hover:text-zinc-400 transition-colors">{t.music}</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-white hover:text-zinc-400 transition-colors">{t.contact}</a>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center text-[10px] font-bold tracking-widest text-zinc-600">
            <button
              onClick={() => setLang('en')}
              className={`hover:text-white transition-colors ${lang === 'en' ? 'text-white' : ''}`}
            >EN</button>
            <span className="mx-2 opacity-20">/</span>
            <button
              onClick={() => setLang('ru')}
              className={`hover:text-white transition-colors ${lang === 'ru' ? 'text-white' : ''}`}
            >RU</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-[100dvh] flex flex-col justify-center items-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-zinc-400 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative z-10 text-center space-y-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-zinc-500">{t.heroSub}</span>
          <h2 className="text-5xl sm:text-7xl md:text-9xl font-heading font-bold tracking-tighter leading-none text-white uppercase">
            DANVIR
          </h2>
          <div className="flex justify-center gap-6 pt-10">
            {SOCIALS.map(social => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="w-5 h-5 md:w-6 md:h-6 text-zinc-500 hover:text-white transition-all transform hover:-translate-y-1 flex items-center justify-center"
                title={social.platform}
              >
                <SocialIcon social={social} className="w-full h-full object-contain" context="hero" />
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30">
          <i className="fa-solid fa-chevron-down text-zinc-100"></i>
        </div>
      </section>

      {/* Music Section */}
      <section id="music" className="max-w-7xl mx-auto px-6 py-20 bg-[#050505]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t.discography}</span>
            <h3 className="text-4xl md:text-5xl font-heading font-bold mt-2 uppercase">{t.selectedWorks}</h3>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm text-zinc-500 uppercase tracking-widest italic">{t.genres}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {releases.map(release => (
            <div key={release.id} className="group">
              <div className="relative aspect-square mb-6 overflow-hidden border border-white/5 bg-zinc-900">
                <img
                  src={release.coverUrl}
                  alt={release.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handlePlayTrack(release.tracks[0], release.id)}
                    className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <i className={`fa-solid ${isPlaying && activeReleaseId === release.id ? 'fa-pause' : 'fa-play'} text-xl`}></i>
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-black/60 text-[10px] uppercase tracking-widest text-white border border-white/10">
                    {release.type} • {release.year}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-heading font-bold uppercase tracking-tight mb-2">{release.title}</h4>
                <p className="text-sm text-zinc-500 mb-6 leading-relaxed line-clamp-2">
                  {release.description}
                </p>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-3 font-bold border-b border-white/5 pb-2">{t.tracklist}</p>
                  {release.tracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handlePlayTrack(track, release.id)}
                      className={`w-full flex justify-between items-center py-2 px-3 text-xs uppercase tracking-widest transition-colors ${currentTrack?.id === track.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-4 text-left opacity-30 italic">{currentTrack?.id === track.id && isPlaying ? <i className="fa-solid fa-volume-high"></i> : ''}</span>
                        <span>{track.title}</span>
                      </div>
                      <span className="opacity-40">{track.duration}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
                  {release.links.spotify && <a href={release.links.spotify} className="text-zinc-600 hover:text-white transition-colors w-4 h-4"><i className="fa-brands fa-spotify"></i></a>}
                  {release.links.yandexMusic && (
                    <a href={release.links.yandexMusic} className="text-zinc-600 hover:text-white transition-colors w-4 h-4 flex items-center justify-center">
                      <YandexMusicIconSVG className="w-full h-full" style={{ transform: 'translateY(20%)' }} />
                    </a>
                  )}
                  {release.links.soundcloud && <a href={release.links.soundcloud} className="text-zinc-600 hover:text-white transition-colors w-4 h-4"><i className="fa-brands fa-soundcloud"></i></a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-40 border-t border-white/5 bg-[#050505]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t.contact}</span>
            <h3 className="text-5xl md:text-6xl font-heading font-bold mt-4 leading-none mb-10 uppercase whitespace-pre-line">{t.getInTouch}</h3>
            <p className="text-zinc-400 max-w-md leading-relaxed mb-8">
              {t.contactText}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-block text-xl md:text-2xl font-heading hover:text-zinc-400 transition-colors border-b border-zinc-800 pb-2 break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="flex flex-col justify-end space-y-8">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-600 font-bold">{t.follow}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SOCIALS.map(social => (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="group flex items-center justify-between p-4 border border-white/5 hover:bg-white/5 transition-all"
                  >
                    <span className="text-xs uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">{social.platform}</span>
                    <div className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors flex items-center justify-center">
                      <SocialIcon social={social} className="w-full h-full" context="contact" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.3em] text-zinc-700 gap-4">
        <p>&copy; 2026 DANVIR AUDIO. {t.rights}</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-500">{t.terms}</a>
          <a href="#" className="hover:text-zinc-500">{t.privacy}</a>
        </div>
      </footer>

      {/* Floating Player */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={getNextTrack}
        onPrev={getPrevTrack}
        lang={lang}
      />
    </div>
  );
};

export default App;
