import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/portfolio';
import { getMediaUrl, formatDate, estimateReadingTime } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';

interface LatestBlogsSectionProps {
  blogs: BlogPost[];
}

export const LatestBlogsSection: React.FC<LatestBlogsSectionProps> = ({ blogs }) => {
  const published = blogs.filter((b) => b.status === 'PUBLISHED');
  const latestList = published.slice(0, 3);

  return (
    <section className="py-20 sm:py-28 border-t border-slate-900 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Engineering Journal"
          title="Articles & Technical Insights"
          subtitle="Deep dives into distributed architecture, reactive microservices, clean code, and developer productivity"
        />

        {latestList.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Articles Coming Soon"
            description="Technical essays and architecture deep-dives are currently in draft."
          />
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestList.map((post) => {
                const coverUrl = post.coverImage ? getMediaUrl(post.coverImage) : null;
                const readingMinutes = estimateReadingTime(post.content);
                const publishedDate = formatDate(post.publishedAt || post.createdAt);

                return (
                  <article
                    key={post.id}
                    className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 overflow-hidden backdrop-blur-xl flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/30"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={`Cover banner for ${post.title}`}
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
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Meta indicators */}
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5 font-medium">
                          {publishedDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{publishedDate}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
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
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-md py-1"
                        >
                          <span>Read Full Article</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <span>Browse All Articles & Tutorials</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogsSection;
