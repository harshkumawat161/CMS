import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import portfolioApi from '@/lib/api';
import { getMediaUrl } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowRight, ExternalLink, Layers, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Production Projects Archive',
  description: 'Curated gallery of open-source architectures, cloud systems, and full-stack software products.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Production Projects Archive | Alexander Sterling',
    description: 'Curated gallery of open-source architectures, cloud systems, and full-stack software products.',
  },
};

export default async function ProjectsPage() {
  const allProjects = await portfolioApi.getProjects();
  const publishedProjects = allProjects
    .filter((p) => p.status === 'PUBLISHED')
    .sort((a, b) => {
      // Prioritize featured builds first, then sort by displayOrder
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.displayOrder - b.displayOrder;
    });

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in space-y-16">
      <SectionHeading
        badge="Software Architecture & Engineering"
        title="Project Showcase"
        subtitle="A selection of production systems, cloud microservices, and interactive applications built to scale"
      />

      {publishedProjects.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Projects Published Yet"
          description="Projects are actively being configured and published via the CMS. Check back shortly!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {publishedProjects.map((project) => {
            const imageUrl = project.image ? getMediaUrl(project.image) : null;
            const isFeatured = !!project.featured;

            return (
              <article
                key={project.id}
                className={`group rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col transition-all duration-300 hover:-translate-y-1.5 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-indigo-950/35 via-slate-900/80 to-slate-950 border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/40 hover:border-indigo-400/80 hover:shadow-indigo-600/20 ring-1 ring-indigo-500/20'
                    : 'bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 shadow-xl hover:shadow-2xl'
                }`}
              >
                {/* Image Banner */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`Preview screenshot of ${project.title}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/30">
                      <Layers className="w-10 h-10 text-slate-700" />
                    </div>
                  )}

                  {isFeatured && (
                    <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/90 text-white backdrop-blur-md shadow-lg border border-indigo-400/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>Featured Build</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {Array.isArray(project.technologies) &&
                        project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-medium border ${
                              isFeatured
                                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25'
                                : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-lg inline-block"
                    >
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight">
                        {project.title}
                      </h3>
                    </Link>

                    <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {project.shortDescription || project.description || 'Production architectural case study.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-md py-1"
                    >
                      <span>Read Deep Dive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-850 text-slate-300 hover:text-white transition-colors border border-slate-700/50 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                          title="View Repository"
                          aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white transition-colors border border-indigo-500/30 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                          title="Live Demo"
                          aria-label={`Visit live demonstration for ${project.title} (opens in new tab)`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
