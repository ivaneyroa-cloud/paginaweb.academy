"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";
import WhatsAppButton from "@/components/academy/WhatsAppButton";
import { SEED_POSTS } from "@/lib/academy/communityData";
import type { User } from "@supabase/supabase-js";

interface Post {
    id: string;
    author: string;
    authorInitial: string;
    avatar: string | null;
    title: string;
    content: string;
    category: string;
    timestamp: number;
    likes: number;
    replies: Reply[];
}

interface Reply {
    id: string;
    author: string;
    authorInitial: string;
    content: string;
    timestamp: number;
    likes: number;
}

const CATEGORIES = [
    { id: "all", label: "Todos", emoji: "📋" },
    { id: "consulta", label: "Consultas", emoji: "❓" },
    { id: "experiencia", label: "Experiencias", emoji: "📦" },
    { id: "alibaba", label: "Alibaba", emoji: "🌐" },
    { id: "aduana", label: "Aduana", emoji: "🛃" },
    { id: "costos", label: "Costos", emoji: "💰" },
];

const STORAGE_KEY = "shippar_community_posts_v2";

function loadPosts(): Post[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return getDefaultPosts();
        return JSON.parse(raw);
    } catch {
        return getDefaultPosts();
    }
}

function savePosts(posts: Post[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function getDefaultPosts(): Post[] {
    return SEED_POSTS.map((s) => ({
        id: s.id,
        author: s.author,
        authorInitial: s.author.charAt(0).toUpperCase(),
        avatar: s.avatar,
        title: s.title,
        content: s.content,
        category: s.category,
        timestamp: Date.now() - s.daysAgo * 86400000,
        likes: s.likes,
        replies: [
            {
                id: `r_${s.id}`,
                author: "Personal Shippar",
                authorInitial: "S",
                content: s.reply,
                timestamp: Date.now() - (s.daysAgo * 86400000 - 3600000),
                likes: Math.floor(s.likes * 0.4),
            },
        ],
    }));
}

function timeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `hace ${days}d`;
}

export default function CommunityPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [showNewPost, setShowNewPost] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "", category: "consulta" });
    const [expandedPost, setExpandedPost] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: any, session: any) => {
                if (!session) {
                    router.push("/academy/login");
                } else {
                    setUser(session.user);
                    setPosts(loadPosts());
                    setLoading(false);
                }
            }
        );
        return () => subscription.unsubscribe();
    }, [router]);

    const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Anónimo";

    const filteredPosts = (activeCategory === "all"
        ? posts
        : posts.filter((p) => p.category === activeCategory)
    ).sort((a, b) => sortBy === "popular" ? b.likes - a.likes : b.timestamp - a.timestamp);

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim()) return;
        const post: Post = {
            id: `p${Date.now()}`,
            author: userName,
            authorInitial: userName.charAt(0).toUpperCase(),
            avatar: null,
            title: newPost.title,
            content: newPost.content,
            category: newPost.category,
            timestamp: Date.now(),
            likes: 0,
            replies: [],
        };
        const updated = [post, ...posts];
        setPosts(updated);
        savePosts(updated);
        setNewPost({ title: "", content: "", category: "consulta" });
        setShowNewPost(false);
    };

    const handleReply = (postId: string) => {
        if (!replyText.trim()) return;
        const updated = posts.map((p) => {
            if (p.id === postId) {
                return {
                    ...p,
                    replies: [
                        ...p.replies,
                        {
                            id: `r${Date.now()}`,
                            author: userName,
                            authorInitial: userName.charAt(0).toUpperCase(),
                            content: replyText,
                            timestamp: Date.now(),
                            likes: 0,
                        },
                    ],
                };
            }
            return p;
        });
        setPosts(updated);
        savePosts(updated);
        setReplyText("");
    };

    const handleLike = (postId: string) => {
        const updated = posts.map((p) =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
        );
        setPosts(updated);
        savePosts(updated);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <WhatsAppButton />

            <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        💬 Comunidad Shippar
                    </h1>
                    <p className="text-text-secondary">
                        Hacé consultas, compartí experiencias y aprendé de otros importadores.
                    </p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id
                                ? "gradient-bg text-white"
                                : "glass text-text-secondary hover:text-white"
                                }`}
                        >
                            {cat.emoji} {cat.label}
                        </button>
                    ))}
                </div>

                {/* Sorting */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-text-muted text-xs">Ordenar:</span>
                    <button
                        onClick={() => setSortBy("recent")}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${sortBy === "recent" ? "bg-white/10 text-white" : "text-text-muted hover:text-white"}`}
                    >
                        🕓 Más recientes
                    </button>
                    <button
                        onClick={() => setSortBy("popular")}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${sortBy === "popular" ? "bg-white/10 text-white" : "text-text-muted hover:text-white"}`}
                    >
                        🔥 Más populares
                    </button>
                </div>

                {/* New Post Button / Form */}
                {!showNewPost ? (
                    <button
                        onClick={() => setShowNewPost(true)}
                        className="w-full mb-6 py-4 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all text-sm"
                    >
                        ✏️ Crear nueva publicación
                    </button>
                ) : (
                    <form onSubmit={handleCreatePost} className="glass-card p-6 mb-6 animate-slide-up">
                        <h3 className="text-white font-bold mb-4">Nueva publicación</h3>
                        <input
                            type="text"
                            placeholder="Título de tu consulta o experiencia"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none transition-colors mb-3"
                        />
                        <textarea
                            placeholder="Contá más detalles..."
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none transition-colors resize-none mb-3"
                        />
                        <div className="flex items-center gap-3">
                            <select
                                value={newPost.category}
                                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                className="px-4 py-2.5 rounded-xl bg-white/5 border border-border-dark text-white text-sm focus:border-primary focus:outline-none transition-colors appearance-none"
                            >
                                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                                    <option key={cat.id} value={cat.id} className="bg-gray-900">
                                        {cat.emoji} {cat.label}
                                    </option>
                                ))}
                            </select>
                            <div className="flex-1" />
                            <button
                                type="button"
                                onClick={() => setShowNewPost(false)}
                                className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm font-medium hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                Publicar
                            </button>
                        </div>
                    </form>
                )}

                {/* Posts */}
                <div className="space-y-4">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-12 glass-card">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-text-secondary">No hay publicaciones en esta categoría aún.</p>
                            <button
                                onClick={() => setShowNewPost(true)}
                                className="mt-4 px-6 py-2 rounded-xl gradient-bg text-white text-sm font-semibold"
                            >
                                Sé el primero en publicar
                            </button>
                        </div>
                    ) : (
                        filteredPosts.map((post) => {
                            const catInfo = CATEGORIES.find((c) => c.id === post.category);
                            const isExpanded = expandedPost === post.id;
                            return (
                                <div key={post.id} className="glass-card overflow-hidden">
                                    {/* Post Header */}
                                    <div className="p-5">
                                        <div className="flex items-start gap-3">
                                            {post.avatar ? (
                                                <img
                                                    src={post.avatar}
                                                    alt={post.author}
                                                    className="w-10 h-10 rounded-full shrink-0 object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full shrink-0 gradient-bg flex items-center justify-center text-white text-sm font-bold">
                                                    {post.authorInitial}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-white text-sm font-semibold">{post.author}</span>
                                                    <span className="text-text-muted text-xs">•</span>
                                                    <span className="text-text-muted text-xs">{timeAgo(post.timestamp)}</span>
                                                    {catInfo && (
                                                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-text-muted text-xs">
                                                            {catInfo.emoji} {catInfo.label}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-white font-bold text-base mb-2">{post.title}</h3>
                                                <p className="text-text-secondary text-sm leading-relaxed">{post.content}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4 mt-4 ml-13">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className="flex items-center gap-1.5 text-text-muted hover:text-primary text-sm transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                </svg>
                                                {post.likes}
                                            </button>
                                            <button
                                                onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                                                className="flex items-center gap-1.5 text-text-muted hover:text-primary text-sm transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                {post.replies.length} {post.replies.length === 1 ? "respuesta" : "respuestas"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Replies */}
                                    {isExpanded && (
                                        <div className="border-t border-border-dark animate-slide-up">
                                            {post.replies.map((reply) => (
                                                <div key={reply.id} className="p-5 pl-16 border-b border-border-dark/50 last:border-b-0">
                                                    <div className="flex items-start gap-3">
                                                        {reply.author === "Personal Shippar" ? (
                                                            <img
                                                                src="/logo-shippar.webp"
                                                                alt="Shippar"
                                                                className="w-8 h-8 rounded-full shrink-0 object-cover bg-white/10 p-0.5"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full shrink-0 gradient-bg flex items-center justify-center text-white text-xs font-bold">
                                                                {reply.authorInitial}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-white text-sm font-semibold">{reply.author}</span>
                                                                <span className="text-text-muted text-xs">{timeAgo(reply.timestamp)}</span>
                                                            </div>
                                                            <p className="text-text-secondary text-sm">{reply.content}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Reply input */}
                                            <div className="p-4 pl-16 bg-white/[0.02]">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Escribí tu respuesta..."
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && replyText.trim()) {
                                                                handleReply(post.id);
                                                            }
                                                        }}
                                                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none transition-colors"
                                                    />
                                                    <button
                                                        onClick={() => handleReply(post.id)}
                                                        disabled={!replyText.trim()}
                                                        className="px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                                                    >
                                                        Enviar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
