-- Скрипт для обновления ссылок на артиста в таблице socials (Финальная версия + Instagram + TikTok)

-- Очищаем текущие данные
TRUNCATE TABLE public.socials;

-- Вставляем актуальные ссылки
INSERT INTO public.socials (platform, url, icon, order_index) VALUES
('Spotify', 'https://open.spotify.com/artist/5GElDhoDb2YoebamMS56wc', 'fa-brands fa-spotify', 1),
('Apple Music', 'https://music.apple.com/us/artist/danvir/1849599425', 'fa-brands fa-apple', 2),
('Yandex Music', 'https://music.yandex.ru/artist/25334390', 'yandex-music', 3),
('Instagram', 'https://www.instagram.com/DANVIR_music', 'fa-brands fa-instagram', 4),
('TikTok', 'https://www.tiktok.com/@danvir_music', 'fa-brands fa-tiktok', 5);
