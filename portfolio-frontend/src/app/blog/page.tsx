import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import portfolioApi from '@/lib/api';
import { getMediaUrl, formatDate, estimateReadingTime } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Blog & Technical Publications',
  description:
    'Deep dives into distributed architecture, reactive microservices, clean code patterns, and cloud scalability.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Engineering Blog & Technical Publications | Alexander Sterling',
    description:
      'Deep dives into distributed architecture, reactive microservices, clean code patterns, and cloud scalability.',
    url: '/blog',
    type: 'website',
  },
};

export default async function BlogPage() {
  const { content: allBlogs } = await portfolioApi.getBlogs(0, 30);
  const publishedBlogs = allBlogs.filter((b) => b.status === 'PUBLISHED');

  const featuredPost = publishedBlogs[0];
  const remainingPosts = publishedBlogs.slice(1);

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in space-y-16">
      <SectionHeading
        badge="Technical Publications"
        title="Engineering Insights & Architecture"
        subtitle="Practical articles and tutorials on backend architectures, cloud systems, and web performance"
      />

      {publishedBlogs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Articles Published Yet"
          description="Technical essays are currently being drafted. Check back soon for fresh content!"
        />
      ) : (
        <div className="space-y-12">
          {/* Featured Latest Article Hero */}
          {featuredPost && (
            <article className="group rounded-3xl bg-gradient-to-b from-indigo-950/30 via-slate-900/80 to-slate-950 border border-indigo-500/30 hover:border-indigo-400/60 overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-indigo-950/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 relative aspect-video bg-slate-950 overflow-hidden">
                  {featuredPost.coverImage ? (
                    <img
                      src={getMediaUrl(featuredPost.coverImage)}
                      alt={`Cover image for ${featuredPost.title}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-950/60 to-slate-900">
                      <BookOpen className="w-12 h-12 text-indigo-400/60" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/90 text-white backdrop-blur-md shadow-md border border-indigo-400/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Latest Release</span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-6 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    {featuredPost.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{formatDate(featuredPost.publishedAt)}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{estimateReadingTime(featuredPost.content)} min read</span>
                    </span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-lg inline-block"
                  >
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-indigo-300 transition-colors tracking-tight leading-snug">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed font-normal">
                    {featuredPost.excerpt || featuredPost.content.substring(0, 180) + '...'}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Read Complete Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Remaining Blog Grid */}
          {remainingPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPosts.map((post) => {
                const coverUrl = post.coverImage ? getMediaUrl(post.coverImage) : null;
                const readingMinutes = estimateReadingTime(post.content);
                const publishedDate = formatDate(post.publishedAt || post.createdAt);

                return (
                  <article
                    key={post.id}
                    className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 overflow-hidden backdrop-blur-xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-950/40"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={`Cover illustration for ${post.title}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/30">
                          <BookOpen className="w-10 h-10 text-slate-700" />
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2 font-medium">
                          {publishedDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-indigo-400" />
                              <span>{publishedDate}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            <span>{readingMinutes} min read</span>
                          </span>
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-lg inline-block"
                        >
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 tracking-tight">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed font-normal">
                          {post.excerpt || post.content.substring(0, 160) + '...'}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-md py-1"
                        >
                          <span>Read Article</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
