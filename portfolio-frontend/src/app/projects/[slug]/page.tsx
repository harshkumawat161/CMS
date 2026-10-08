import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import portfolioApi from '@/lib/api';
import { getMediaUrl } from '@/lib/utils';
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await portfolioApi.getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const imageUrl = project.image ? getMediaUrl(project.image) : undefined;

  return {
    title: `${project.title} | Case Study`,
    description:
      project.shortDescription ||
      `Architectural case study and engineering specifications for ${project.title}`,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: `${project.title} | Case Study`,
      description:
        project.shortDescription || `Case study for ${project.title}`,
      url: `/projects/${slug}`,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Case Study`,
      description:
        project.shortDescription || `Case study for ${project.title}`,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await portfolioApi.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const imageUrl = project.image ? getMediaUrl(project.image) : null;

  return (
    <div className="py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-900 w-fit focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Archive</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {project.featured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Featured Project</span>
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Production Build
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {project.title}
        </h1>

        {project.shortDescription && (
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {project.shortDescription}
          </p>
        )}

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3.5 pt-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label={`Open live application for ${project.title} (opens in new tab)`}
            >
              <span>Visit Live Application</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
            >
              <GithubIcon className="w-4 h-4" />
              <span>View Source Code</span>
            </a>
          )}
        </div>
      </div>

      {/* Hero Media Cover */}
      {imageUrl && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-2xl">
          <img
            src={imageUrl}
            alt={`Detailed architecture overview for ${project.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Main Description */}
        <div className="md:col-span-2 p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Architecture & Implementation</span>
          </h2>

          <div className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line space-y-4 font-normal">
            {project.description || project.shortDescription || 'No in-depth writeup provided.'}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(project.technologies) &&
                project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-mono font-medium bg-slate-800 text-slate-200 border border-slate-700/60"
                  >
                    {tech}
                  </span>
                ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deployment State
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Production Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
