import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LegalPageProps {
    type: 'terms' | 'privacy';
    lang: 'en' | 'ru';
}

const LegalPages: React.FC<LegalPageProps> = ({ type, lang }) => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [type]);

    const content = {
        terms: {
            en: {
                title: 'Terms of Use',
                sections: [
                    {
                        h: 'Acceptance of Terms',
                        p: 'By accessing this website, you agree to be bound by these Terms of Use and all applicable laws and regulations.'
                    },
                    {
                        h: 'Intellectual Property',
                        p: 'All content on this site, including music, images, text, and design, is the property of DANVIR and protected by copyright laws. Unauthorized reproduction is strictly prohibited.'
                    },
                    {
                        h: 'Use of Site',
                        p: 'This site is intended for personal, non-commercial use only. You may listen to music and view content for your own enjoyment.'
                    },
                    {
                        h: 'Third-Party Links',
                        p: 'Our site contains links to external music platforms (Spotify, Apple Music, etc.). We are not responsible for the content or practices of these external sites.'
                    }
                ]
            },
            ru: {
                title: 'Условия использования',
                sections: [
                    {
                        h: 'Принятие условий',
                        p: 'Заходя на этот сайт, вы соглашаетесь соблюдать настоящие Условия использования и все применимые законы и правила.'
                    },
                    {
                        h: 'Интеллектуальная собственность',
                        p: 'Весь контент на этом сайте, включая музыку, изображения, текст и дизайн, является собственностью DANVIR и защищен законами об авторском праве. Несанкционированное воспроизведение строго запрещено.'
                    },
                    {
                        h: 'Использование сайта',
                        p: 'Этот сайт предназначен только для личного некоммерческого использования. Вы можете слушать музыку и просматривать контент для собственного удовольствия.'
                    },
                    {
                        h: 'Сторонние ссылки',
                        p: 'Наш сайт содержит ссылки на внешние музыкальные платформы (Spotify, Apple Music и др.). Мы не несем ответственности за содержание или практику этих внешних сайтов.'
                    }
                ]
            }
        },
        privacy: {
            en: {
                title: 'Privacy Policy',
                sections: [
                    {
                        h: 'Information Collection',
                        p: 'We do not collect personal identification information from our visitors. We may collect non-personal information such as browser type and anonymous usage data to improve the site experience.'
                    },
                    {
                        h: 'Cookies',
                        p: 'We use cookies to ensure the basic functionality of the site. By using this site, you consent to the use of these cookies.'
                    },
                    {
                        h: 'Third-Party Services',
                        p: 'We use third-party services like Supabase for data storage and various streaming platforms for music delivery. These services have their own privacy policies.'
                    },
                    {
                        h: 'Contact',
                        p: 'If you have any questions about this Privacy Policy, please contact us at info@danvir.ru.'
                    }
                ]
            },
            ru: {
                title: 'Политика конфиденциальности',
                sections: [
                    {
                        h: 'Сбор информации',
                        p: 'Мы не собираем личную идентификационную информацию наших посетителей. Мы можем собирать неличную информацию, такую как тип браузера и анонимные данные об использовании, для улучшения работы сайта.'
                    },
                    {
                        h: 'Cookies',
                        p: 'Мы используем файлы cookie для обеспечения базовой функциональности сайта. Используя этот сайт, вы соглашаетесь на использование этих файлов.'
                    },
                    {
                        h: 'Сторонние сервисы',
                        p: 'Мы используем сторонние сервисы, такие как Supabase для хранения данных и различные стриминговые платформы для воспроизведения музыки. У этих сервисов есть собственные политики конфиденциальности.'
                    },
                    {
                        h: 'Контакты',
                        p: 'Если у вас есть вопросы по поводу этой Политики конфиденциальности, свяжитесь с нами по адресу info@danvir.ru.'
                    }
                ]
            }
        }
    };

    const current = content[type][lang];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black py-40 px-6">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="text-zinc-500 hover:text-white transition-colors mb-20 flex items-center gap-2 text-xs uppercase tracking-[0.3em]"
                >
                    <i className="fa-solid fa-arrow-left"></i> {lang === 'ru' ? 'Назад' : 'Back'}
                </button>

                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-20 uppercase tracking-tighter">
                    {current.title}
                </h1>

                <div className="space-y-16">
                    {current.sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h2 className="text-xs uppercase tracking-[0.4em] text-zinc-500 font-bold">{section.h}</h2>
                            <p className="text-zinc-400 leading-relaxed text-lg font-light">
                                {section.p}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-32 pt-20 border-t border-white/5 text-[10px] uppercase tracking-[0.3em] text-zinc-700">
                    &copy; 2026 DANVIR AUDIO. {lang === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
                </div>
            </div>
        </div>
    );
};

export default LegalPages;
