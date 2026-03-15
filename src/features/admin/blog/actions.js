'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ==========================================
// PUBLIC — Fetch published blog posts
// ==========================================

export async function getPublishedBlogPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, tags, read_time, icon, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
  return data;
}

export async function getBlogPostBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
  return data;
}

// ==========================================
// ADMIN — Full CRUD
// ==========================================

export async function getAllBlogPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, tags, read_time, published, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching all blog posts:", error);
    return [];
  }
  return data;
}

export async function getBlogPostById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching blog post by id:", error);
    return null;
  }
  return data;
}

export async function createBlogPost(postData) {
  const supabase = await createClient();

  const payload = {
    slug: postData.slug,
    title: postData.title,
    meta_title: postData.meta_title || null,
    meta_description: postData.meta_description || null,
    excerpt: postData.excerpt || null,
    content: postData.content,
    tags: postData.tags || [],
    read_time: postData.read_time || '5 min',
    icon: postData.icon || 'document',
    published: postData.published || false,
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error creating blog post:", error);
    return { success: false, message: error.message };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  return { success: true, data };
}

export async function updateBlogPost(id, postData) {
  const supabase = await createClient();

  const payload = {
    slug: postData.slug,
    title: postData.title,
    meta_title: postData.meta_title || null,
    meta_description: postData.meta_description || null,
    excerpt: postData.excerpt || null,
    content: postData.content,
    tags: postData.tags || [],
    read_time: postData.read_time || '5 min',
    icon: postData.icon || 'document',
    published: postData.published || false,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('blog_posts')
    .update(payload)
    .eq('id', id);

  if (error) {
    console.error("Error updating blog post:", error);
    return { success: false, message: error.message };
  }

  revalidatePath('/blog');
  revalidatePath(`/blog/${postData.slug}`);
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function deleteBlogPost(id) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, message: error.message };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function toggleBlogPostPublished(id, published) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('blog_posts')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error("Error toggling blog post published:", error);
    return { success: false, message: error.message };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  return { success: true };
}
