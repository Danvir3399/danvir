import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Release, Track } from '../types';
import { LogIn, Plus, Trash2, Save, X, ExternalLink, Music, GripVertical, Upload, Loader2 } from 'lucide-react';

const AdminPanel = () => {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [releases, setReleases] = useState<Release[]>([]);
    const [editingRelease, setEditingRelease] = useState<any | null>(null);

    useEffect(() => {
        if (!supabase) return;

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            fetchReleases();
        }
    }, [session]);

    const fetchReleases = async () => {
        const { data, error } = await supabase
            .from('releases')
            .select('*, tracks(*)')
            .order('year', { ascending: false });

        if (data) setReleases(data as any);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        setLoading(false);
    };

    const handleLogout = () => supabase.auth.signOut();

    const handleFileUpload = async (file: File, bucket: string, path: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSaveRelease = async () => {
        setLoading(true);
        const { tracks, ...releaseData } = editingRelease;

        // 1. Save or Update Release
        let releaseId = releaseData.id;
        if (releaseId) {
            const { error } = await supabase.from('releases').update({
                title: releaseData.title,
                year: releaseData.year,
                type: releaseData.type,
                cover_url: releaseData.coverUrl,
                description_ru: releaseData.description_ru,
                description_en: releaseData.description_en,
                links: releaseData.links || {},
            }).eq('id', releaseId);
            if (error) alert(error.message);
        } else {
            const { data, error } = await supabase.from('releases').insert({
                title: releaseData.title,
                year: releaseData.year,
                type: releaseData.type,
                cover_url: releaseData.coverUrl,
                description_ru: releaseData.description_ru,
                description_en: releaseData.description_en,
                links: releaseData.links || {},
            }).select().single();
            if (error) alert(error.message);
            if (data) releaseId = data.id;
        }

        // 2. Save Tracks
        if (releaseId) {
            // Simple strategy: delete all tracks and re-insert
            await supabase.from('tracks').delete().eq('release_id', releaseId);
            const tracksToInsert = tracks.map((t: any, index: number) => ({
                release_id: releaseId,
                title: t.title,
                audio_url: t.audioUrl,
                duration: t.duration,
                order_index: index
            }));
            const { error } = await supabase.from('tracks').insert(tracksToInsert);
            if (error) alert(error.message);
        }

        setLoading(false);
        setEditingRelease(null);
        fetchReleases();
    };

    const handleDeleteRelease = async (id: string) => {
        if (confirm('Are you sure you want to delete this release?')) {
            const { error } = await supabase.from('releases').delete().eq('id', id);
            if (error) alert(error.message);
            fetchReleases();
        }
    };

    if (!supabase) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-900/20 border border-red-900/50 p-8 rounded-2xl backdrop-blur-sm text-center">
                    <h1 className="text-xl font-bold mb-4 text-red-400">Database Connection Error</h1>
                    <p className="text-sm text-zinc-400">
                        Похоже, ключи в файле <code className="text-white">.env.local</code> не настроены или указаны неверно.
                    </p>
                    <div className="mt-6 text-xs text-zinc-500 bg-black/40 p-3 rounded text-left overflow-x-auto">
                        Проверьте, что:<br />
                        1. Вы заменили PLACEHOLDER-текст на реальные ключи.<br />
                        2. Ключи начинаются на <code className="text-zinc-300">https://</code> и <code className="text-zinc-300">eyJ...</code>.<br />
                        3. Вы перезагрузили сервер после сохранения файла.
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-2xl font-heading font-bold tracking-tighter uppercase whitespace-pre">DANVIR\nADMIN</h1>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? 'Logging in...' : <><LogIn size={18} /> Login</>}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] p-4 md:p-8 pb-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-heading font-bold tracking-tighter">DASHBOARD</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setEditingRelease({ tracks: [] })}
                            className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all text-sm"
                        >
                            <Plus size={16} /> New Release
                        </button>
                        <button onClick={handleLogout} className="text-zinc-500 hover:text-white transition-colors text-sm">Logout</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {releases.map((release) => (
                        <div key={release.id} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 group hover:border-zinc-600 transition-all">
                            <div className="aspect-square bg-zinc-800 rounded-lg mb-4 overflow-hidden relative">
                                <img src={release.coverUrl || release.cover_url} alt={release.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold">{release.title}</h3>
                                    <p className="text-zinc-500 text-xs tracking-widest uppercase">{release.year} • {release.type}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingRelease(release)} className="p-2 text-zinc-500 hover:text-white bg-black/50 rounded-lg"><ExternalLink size={16} /></button>
                                    <button onClick={() => handleDeleteRelease(release.id)} className="p-2 text-zinc-500 hover:text-red-500 bg-black/50 rounded-lg"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingRelease && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold">{editingRelease.id ? 'Edit Release' : 'New Release'}</h2>
                            <button onClick={() => setEditingRelease(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Title</label>
                                    <input
                                        type="text"
                                        value={editingRelease.title || ''}
                                        onChange={e => setEditingRelease({ ...editingRelease, title: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 p-2 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Year</label>
                                    <input
                                        type="text"
                                        value={editingRelease.year || ''}
                                        onChange={e => setEditingRelease({ ...editingRelease, year: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 p-2 rounded text-white"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Type</label>
                                    <select
                                        value={editingRelease.type || 'Album'}
                                        onChange={e => setEditingRelease({ ...editingRelease, type: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 p-2 rounded text-white"
                                    >
                                        <option value="Album">Album</option>
                                        <option value="EP">EP</option>
                                        <option value="Single">Single</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Cover URL / Upload</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editingRelease.coverUrl || editingRelease.cover_url || ''}
                                            onChange={e => setEditingRelease({ ...editingRelease, cover_url: e.target.value, coverUrl: e.target.value })}
                                            className="flex-1 bg-black border border-zinc-800 p-2 rounded text-white text-xs"
                                        />
                                        <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 p-2 rounded transition-colors flex items-center justify-center">
                                            <Upload size={16} />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        try {
                                                            setLoading(true);
                                                            const url = await handleFileUpload(file, 'media', 'covers');
                                                            setEditingRelease({ ...editingRelease, cover_url: url, coverUrl: url });
                                                        } catch (err: any) {
                                                            alert('Upload error: ' + err.message);
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Description (RU)</label>
                                    <textarea
                                        value={editingRelease.description_ru || ''}
                                        onChange={e => setEditingRelease({ ...editingRelease, description_ru: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 p-2 rounded text-white h-24"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Description (EN)</label>
                                    <textarea
                                        value={editingRelease.description_en || ''}
                                        onChange={e => setEditingRelease({ ...editingRelease, description_en: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 p-2 rounded text-white h-24"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Platform Links</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[10px] text-zinc-600 mb-1">Spotify URL</label>
                                        <input
                                            type="text"
                                            value={editingRelease.links?.spotify || ''}
                                            onChange={e => setEditingRelease({ ...editingRelease, links: { ...editingRelease.links, spotify: e.target.value } })}
                                            className="w-full bg-zinc-800/50 border border-zinc-800 p-2 rounded text-white text-[10px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-zinc-600 mb-1">Apple Music URL</label>
                                        <input
                                            type="text"
                                            value={editingRelease.links?.appleMusic || ''}
                                            onChange={e => setEditingRelease({ ...editingRelease, links: { ...editingRelease.links, appleMusic: e.target.value } })}
                                            className="w-full bg-zinc-800/50 border border-zinc-800 p-2 rounded text-white text-[10px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-zinc-600 mb-1">Yandex Music URL</label>
                                        <input
                                            type="text"
                                            value={editingRelease.links?.yandexMusic || ''}
                                            onChange={e => setEditingRelease({ ...editingRelease, links: { ...editingRelease.links, yandexMusic: e.target.value } })}
                                            className="w-full bg-zinc-800/50 border border-zinc-800 p-2 rounded text-white text-[10px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-zinc-600 mb-1">SoundCloud URL</label>
                                        <input
                                            type="text"
                                            value={editingRelease.links?.soundcloud || ''}
                                            onChange={e => setEditingRelease({ ...editingRelease, links: { ...editingRelease.links, soundcloud: e.target.value } })}
                                            className="w-full bg-zinc-800/50 border border-zinc-800 p-2 rounded text-white text-[10px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-zinc-600 mb-1">YouTube Music URL</label>
                                        <input
                                            type="text"
                                            value={editingRelease.links?.youtubeMusic || ''}
                                            onChange={e => setEditingRelease({ ...editingRelease, links: { ...editingRelease.links, youtubeMusic: e.target.value } })}
                                            className="w-full bg-zinc-800/50 border border-zinc-800 p-2 rounded text-white text-[10px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tracklist Manager */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Tracklist</label>
                                    <button
                                        onClick={() => setEditingRelease({ ...editingRelease, tracks: [...(editingRelease.tracks || []), { title: '', audioUrl: '', duration: '' }] })}
                                        className="text-[10px] uppercase tracking-widest text-white bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-700 transition"
                                    >
                                        + Add Track
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {editingRelease.tracks?.map((track: any, index: number) => (
                                        <div key={index} className="flex gap-2 items-center bg-black/40 p-2 rounded border border-zinc-800/50">
                                            <GripVertical size={14} className="text-zinc-700" />
                                            <input
                                                placeholder="Title"
                                                value={track.title}
                                                onChange={e => {
                                                    const newTracks = [...editingRelease.tracks];
                                                    newTracks[index].title = e.target.value;
                                                    setEditingRelease({ ...editingRelease, tracks: newTracks });
                                                }}
                                                className="flex-1 bg-transparent border-none text-xs focus:ring-0"
                                            />
                                            <div className="flex-1 flex gap-1">
                                                <input
                                                    placeholder="Audio URL"
                                                    value={track.audioUrl}
                                                    onChange={e => {
                                                        const newTracks = [...editingRelease.tracks];
                                                        newTracks[index].audioUrl = e.target.value;
                                                        setEditingRelease({ ...editingRelease, tracks: newTracks });
                                                    }}
                                                    className="flex-1 bg-transparent border-none text-[10px] focus:ring-0"
                                                />
                                                <label className="cursor-pointer text-zinc-500 hover:text-white flex items-center">
                                                    <Upload size={12} />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="audio/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                try {
                                                                    setLoading(true);
                                                                    const url = await handleFileUpload(file, 'media', 'tracks');
                                                                    const newTracks = [...editingRelease.tracks];
                                                                    newTracks[index].audioUrl = url;
                                                                    setEditingRelease({ ...editingRelease, tracks: newTracks });
                                                                } catch (err: any) {
                                                                    alert('Upload error: ' + err.message);
                                                                } finally {
                                                                    setLoading(false);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                            <input
                                                placeholder="Duration"
                                                value={track.duration}
                                                onChange={e => {
                                                    const newTracks = [...editingRelease.tracks];
                                                    newTracks[index].duration = e.target.value;
                                                    setEditingRelease({ ...editingRelease, tracks: newTracks });
                                                }}
                                                className="w-16 bg-transparent border-none text-xs focus:ring-0"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newTracks = editingRelease.tracks.filter((_: any, i: number) => i !== index);
                                                    setEditingRelease({ ...editingRelease, tracks: newTracks });
                                                }}
                                                className="text-zinc-700 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleSaveRelease}
                                disabled={loading}
                                className="w-full bg-white text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                            >
                                {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
