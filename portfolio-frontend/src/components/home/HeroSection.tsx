import React from 'react';
import Link from 'next/link';
import { AboutProfile } from '@/types/portfolio';
import { getMediaUrl } from '@/lib/utils';
import { ArrowRight, FileText, Sparkles, MapPin, Mail } from 'lucide-react';

interface HeroSectionProps {
  about: AboutProfile | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ about }) => {
  const name = about?.name || 'Alexander Sterling';
  const headline =
    about?.headline || 'Senior Full-Stack Engineer & Distributed Systems Architect';
  const bio =
    about?.bio ||
    'Building robust, resilient microservices, high-performance web applications, and scalable cloud architectures.';
  const location = about?.location || 'San Francisco, CA';
  const profileImage = about?.profileImage ? getMediaUrl(about.profileImage) : null;

  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Background radiant gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full-Stack Developer & Cloud Architect</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200">
                {name}
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-300 leading-snug">
              {headline}
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {bio}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-400">
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{location}</span>
                </span>
              )}
              {about?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a
                    href={`mailto:${about.email}`}
                    className="hover:text-white transition-colors focus-visible:underline focus-visible:outline-none"
                  >
                    {about.email}
                  </a>
                </span>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <span>View Selected Work</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 text-slate-200 border border-slate-800 text-sm font-semibold transition-all hover:border-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <span>Contact Me</span>
              </Link>

              {about?.resumeUrl && (
                <a
                  href={getMediaUrl(about.resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  aria-label="Download professional resume PDF (opens in new tab)"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Resume PDF</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column / Avatar Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />

              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-2 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`Portrait avatar of ${name}`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center text-center p-6 border border-indigo-500/20">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-3xl font-extrabold text-indigo-400 mb-3 shadow-inner">
                      {name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-white">{name}</span>
                    <span className="text-xs text-indigo-300/80 mt-1">Full-Stack Engineer</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
