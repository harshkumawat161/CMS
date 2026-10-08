import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import portfolioApi from '@/lib/api';
import { getMediaUrl } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import {
  FileText,
  Mail,
  MapPin,
  Sparkles,
  Terminal,
  Code2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Me & Engineering Philosophy',
  description:
    'Detailed professional background, distributed systems architecture philosophy, and engineering credentials.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Me & Engineering Philosophy | Alexander Sterling',
    description:
      'Detailed professional background, distributed systems architecture philosophy, and engineering credentials.',
    url: '/about',
    type: 'profile',
  },
};

export default async function AboutPage() {
  const about = await portfolioApi.getAbout();

  if (!about) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <EmptyState
          icon={Terminal}
          title="Profile Information Offline"
          description="The professional profile is currently updating via the CMS backend. Please check back shortly."
        />
      </div>
    );
  }

  const profileImage = about.profileImage ? getMediaUrl(about.profileImage) : null;
  const resumeUrl = about.resumeUrl ? getMediaUrl(about.resumeUrl) : null;

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in space-y-16">
      <SectionHeading
        badge="Profile & Credentials"
        title="Background & Engineering Philosophy"
        subtitle="Bridging deep backend systems architecture with polished, high-performance web engineering"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column - Card Profile */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="relative aspect-square rounded-2xl bg-slate-950 overflow-hidden border border-slate-800">
            {profileImage ? (
              <img
                src={profileImage}
                alt={about.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-950 to-slate-900 text-4xl font-bold text-indigo-400">
                {about.name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{about.name}</h2>
            <p className="text-sm font-semibold text-indigo-400 mt-0.5">{about.headline}</p>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
            {about.location && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{about.location}</span>
              </div>
            )}
            {about.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`mailto:${about.email}`} className="hover:text-white transition-colors">
                  {about.email}
                </a>
              </div>
            )}
          </div>

          {resumeUrl && (
            <div className="pt-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume / CV</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column - Comprehensive Bio & Core Principles */}
        <div className="lg:col-span-7 space-y-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span>Full Biography</span>
            </h3>

            <div className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line space-y-4 font-normal">
              {about.bio}
            </div>
          </div>

          {/* Pillars of Engineering Excellence */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Core Architectural Tenets</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {[
                { title: 'Stateless Scalability', desc: 'Designing horizontal scalability with cloud-native containers and zero session lock-in.' },
                { title: 'Resilience First', desc: 'Circuit breakers, backoff strategies, and graceful degradation during partial outages.' },
                { title: 'Observable Systems', desc: 'Actionable metrics, structured tracing, and deep telemetry baked in at inception.' },
                { title: 'User-First Precision', desc: 'Microsecond API responses combined with responsive, accessible frontend UX.' },
              ].map((tenet, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tenet.title}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{tenet.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Have questions or a prospective project? Let's talk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
