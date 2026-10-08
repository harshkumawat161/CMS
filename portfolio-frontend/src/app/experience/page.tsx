import React from 'react';
import type { Metadata } from 'next';
import portfolioApi from '@/lib/api';
import { formatDate } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { Briefcase, Calendar, Building2, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Work Experience & Career Timeline',
  description:
    'Chronological career history, software leadership roles, and enterprise systems delivered across industry.',
  alternates: {
    canonical: '/experience',
  },
  openGraph: {
    title: 'Work Experience & Career Timeline | Alexander Sterling',
    description:
      'Chronological career history, software leadership roles, and enterprise systems delivered across industry.',
    url: '/experience',
    type: 'website',
  },
};

export default async function ExperiencePage() {
  const experiences = await portfolioApi.getExperiences();
  const sorted = [...experiences].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in space-y-16">
      <SectionHeading
        badge="Career Trajectory"
        title="Experience & Technical Leadership"
        subtitle="Chronological timeline of engineering roles, systems leadership, and production platform achievements"
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Career Records Syncing"
          description="Experience records are currently being managed via the CMS."
        />
      ) : (
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {sorted.map((item, idx) => {
            const formattedStart = formatDate(item.startDate);
            const formattedEnd = item.current ? 'Present' : formatDate(item.endDate);
            const isCurrent = !!item.current;

            return (
              <div key={item.id || idx} className="relative group">
                {/* Glowing Node on Timeline */}
                <div
                  className={`absolute -left-[35px] sm:-left-[51px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 border-2 border-indigo-400 ring-4 ring-indigo-500/20 text-white shadow-lg shadow-indigo-600/40'
                      : 'bg-slate-900 border-2 border-slate-700 text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-400'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                </div>

                <div
                  className={`p-7 sm:p-9 rounded-3xl backdrop-blur-xl transition-all space-y-4 shadow-xl ${
                    isCurrent
                      ? 'bg-gradient-to-b from-indigo-950/25 via-slate-900/80 to-slate-950 border border-indigo-500/35 shadow-indigo-950/30'
                      : 'bg-slate-900/60 border border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {item.position}
                        </h3>
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                            Active Position
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mt-0.5">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{item.company}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 w-fit">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>
                        {formattedStart} — {formattedEnd}
                      </span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                      {item.description}
                    </p>
                  )}

                  {Array.isArray(item.technologies) && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                      {item.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
