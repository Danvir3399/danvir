import { createClient } from '@supabase/supabase-js';
import { Release, SocialLink } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Data will be static from constants.tsx');
}

// Валидация URL перед инициализацией
const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const supabase = (isValidUrl(supabaseUrl) && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as any); // Возвращаем null, если ключи неверны

if (!supabase) {
    console.warn('Supabase credentials missing or invalid. Admin panel will not work.');
}

// Типы данных для БД (соответствуют нашим типам в приложении)
export interface Database {
    public: {
        Tables: {
            releases: {
                Row: Release;
                Insert: Omit<Release, 'id'> & { id?: string };
                Update: Partial<Omit<Release, 'id'>>;
            };
            socials: {
                Row: SocialLink;
                Insert: SocialLink;
                Update: Partial<SocialLink>;
            };
        };
    };
}
