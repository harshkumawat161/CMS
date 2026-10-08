import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import portfolioApi from '@/lib/api';
import { getMediaUrl, formatDate, estimateReadingTime } from '@/lib/utils';
import { ArrowLeft, Calendar, Clock, Terminal, CheckCircle2 } from 'lucide-react';
import ShareButton from '@/components/blog/ShareButton';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await portfolioApi.getBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const coverUrl = post.coverImage ? getMediaUrl(post.coverImage) : undefined;

  return {
    title: `${post.title} | Engineering Blog`,
    description: post.excerpt || `Read ${post.title}`,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title}`,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      images: coverUrl ? [{ url: coverUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read ${post.title}`,
      images: coverUrl ? [coverUrl] : undefined,
    },
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await portfolioApi.getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverUrl = post.coverImage ? getMediaUrl(post.coverImage) : null;
  const publishedDate = formatDate(post.publishedAt || post.createdAt);
  const readingMinutes = estimateReadingTime(post.content);

  return (
    <article className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in space-y-10">
      {/* Back button and share action */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-900 w-fit focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        <ShareButton title={post.title} />
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          {publishedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{publishedDate}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{readingMinutes} min read</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Cover Banner */}
      {coverUrl && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-2xl">
          <img
            src={coverUrl}
            alt={`Cover banner for ${post.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
        <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap space-y-6 font-normal">
          {post.content}
        </div>
      </div>

      {/* Author Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xl shrink-0">
          <Terminal className="w-7 h-7" />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-base font-bold text-white">Written by Alexander Sterling</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Principal Systems Architect & Full-Stack Engineer writing about high-concurrency architectures, enterprise Spring Boot microservices, and modern web applications.
          </p>
        </div>
      </div>

      {/* Footer Return CTA */}
      <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-semibold text-indigo-400 hover:text-indigo-300 focus-visible:underline focus-visible:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>More Engineering Articles</span>
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 font-semibold text-slate-300 hover:text-white focus-visible:underline focus-visible:outline-none"
        >
          <span>Discuss This Topic</span>
        </Link>
      </div>
    </article>
  );
}
