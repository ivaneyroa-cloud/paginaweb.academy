'use client';

import { useState, useCallback } from 'react';
import { createBlogPost, updateBlogPost, deleteBlogPost, toggleBlogPostPublished } from '../actions';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSave, FiX, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';

const ICON_OPTIONS = [
  { value: 'truck', label: '🚛 Truck' },
  { value: 'ship', label: '🚢 Ship' },
  { value: 'chart', label: '📊 Chart' },
  { value: 'document', label: '📄 Document' },
];

const EMPTY_POST = {
  slug: '',
  title: '',
  meta_title: '',
  meta_description: '',
  excerpt: '',
  content: '',
  tags: [],
  read_time: '5 min',
  icon: 'document',
  published: false,
};

export default function BlogAdminClient({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [editing, setEditing] = useState(null); // null = list view, 'new' = create, post object = edit
  const [form, setForm] = useState(EMPTY_POST);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  // Open editor
  const handleNew = () => {
    setForm(EMPTY_POST);
    setTagsInput('');
    setEditing('new');
  };

  const handleEdit = (post) => {
    setForm({
      ...post,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      tags: post.tags || [],
      read_time: post.read_time || '5 min',
      icon: post.icon || 'document',
      published: post.published || false,
    });
    setTagsInput((post.tags || []).join(', '));
    setEditing(post);
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(EMPTY_POST);
    setTagsInput('');
  };

  // Save
  const handleSave = async () => {
    if (!form.slug || !form.title || !form.content) {
      showMessage('Slug, título y contenido son obligatorios.', 'error');
      return;
    }

    setSaving(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const postData = { ...form, tags };

    let result;
    if (editing === 'new') {
      result = await createBlogPost(postData);
      if (result.success) {
        setPosts(prev => [result.data, ...prev]);
        showMessage('Artículo creado');
        setEditing(null);
      }
    } else {
      result = await updateBlogPost(editing.id, postData);
      if (result.success) {
        setPosts(prev => prev.map(p => p.id === editing.id ? { ...p, ...postData, tags } : p));
        showMessage('Artículo actualizado');
        setEditing(null);
      }
    }

    if (!result.success) {
      showMessage(result.message || 'Error al guardar', 'error');
    }
    setSaving(false);
  };

  // Toggle publish
  const handleTogglePublish = async (post) => {
    const result = await toggleBlogPostPublished(post.id, !post.published);
    if (result.success) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
      showMessage(post.published ? 'Artículo despublicado' : 'Artículo publicado');
    }
  };

  // Delete
  const handleDelete = async (post) => {
    if (!confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return;
    const result = await deleteBlogPost(post.id);
    if (result.success) {
      setPosts(prev => prev.filter(p => p.id !== post.id));
      showMessage('Artículo eliminado');
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
  };

  // ── List View ──
  if (!editing) {
    return (
      <div>
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            {message.text}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{posts.length} artículo{posts.length !== 1 ? 's' : ''}</p>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
          >
            <FiPlus size={16} /> Nuevo artículo
          </button>
        </div>

        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${post.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {post.published ? 'Publicado' : 'Borrador'}
                  </span>
                  {(post.tags || []).map(tag => (
                    <span key={tag} className="text-xs text-slate-400">{tag}</span>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-slate-800 truncate">{post.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">/{post.slug} · {post.read_time}</p>
              </div>
              <div className="flex items-center gap-1">
                {post.published && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                    title="Ver en el blog"
                  >
                    <FiExternalLink size={16} />
                  </Link>
                )}
                <button onClick={() => handleTogglePublish(post)} className="p-2 text-slate-400 hover:text-amber-600 transition-colors" title={post.published ? 'Despublicar' : 'Publicar'}>
                  {post.published ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
                <button onClick={() => handleEdit(post)} className="p-2 text-slate-400 hover:text-sky-600 transition-colors" title="Editar">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => handleDelete(post)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Eliminar">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              No hay artículos todavía. Creá el primero.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Editor View ──
  return (
    <div>
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          {editing === 'new' ? 'Nuevo artículo' : 'Editar artículo'}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <FiX size={16} /> Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
          >
            <FiSave size={16} /> {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title + Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm(prev => ({
                  ...prev,
                  title,
                  slug: editing === 'new' ? generateSlug(title) : prev.slug,
                }));
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
              placeholder="Cómo importar productos a Argentina..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
              placeholder="como-importar-argentina"
            />
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Title (SEO)</label>
            <input
              type="text"
              value={form.meta_title}
              onChange={(e) => setForm(prev => ({ ...prev, meta_title: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
              placeholder="Para el <title> tag"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Description (SEO)</label>
            <input
              type="text"
              value={form.meta_description}
              onChange={(e) => setForm(prev => ({ ...prev, meta_description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
              placeholder="Descripción para buscadores"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Extracto (para cards)</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
            placeholder="Breve resumen que aparece en el listado del blog"
          />
        </div>

        {/* Tags + Read Time + Icon + Published */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tags (separados por coma)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
              placeholder="Guía, Principiantes"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tiempo de lectura</label>
            <input
              type="text"
              value={form.read_time}
              onChange={(e) => setForm(prev => ({ ...prev, read_time: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
              placeholder="5 min"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Icono</label>
            <select
              value={form.icon}
              onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
            >
              {ICON_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Estado</label>
            <select
              value={form.published ? 'published' : 'draft'}
              onChange={(e) => setForm(prev => ({ ...prev, published: e.target.value === 'published' }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        {/* Content — HTML editor */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Contenido (HTML) *</label>
          <p className="text-xs text-slate-400 mb-2">
            Escribí el contenido en HTML. Usá &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;table&gt;, &lt;blockquote&gt;, &lt;details&gt; y &lt;a&gt;. Los estilos se aplican automáticamente.
          </p>
          <textarea
            value={form.content}
            onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
            rows={20}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono resize-y focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all"
            placeholder="<h2>Tu primer heading</h2>\n<p>Contenido del artículo...</p>"
          />
        </div>
      </div>
    </div>
  );
}
