-- Скрипт для создания таблиц в Supabase SQL Editor

-- 1. Таблица релизов
CREATE TABLE IF NOT EXISTS public.releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    year TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Album', 'EP', 'Single'
    cover_url TEXT,
    description_en TEXT,
    description_ru TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Таблица треков (связана с релизами)
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    release_id UUID REFERENCES public.releases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration TEXT,
    audio_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Таблица соцсетей
CREATE TABLE IF NOT EXISTS public.socials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL, -- CSS class or identifier
    order_index INTEGER DEFAULT 0
);

-- Включение RLS (Row Level Security)
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socials ENABLE ROW LEVEL SECURITY;

-- Политики доступа: всем на чтение
CREATE POLICY "Allow public read access" ON public.releases FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.socials FOR SELECT USING (true);

-- Политики доступа: только аутентифицированным на изменение (для админки)
CREATE POLICY "Allow authenticated changes" ON public.releases FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated changes" ON public.tracks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated changes" ON public.socials FOR ALL TO authenticated USING (true);
