import React from 'react';
import Link from 'next/link';
import { Experience } from '@/types/portfolio';
import { formatDate } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowRight, Briefcase, Calendar, Building2 } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const sorted = [...experiences].sort((a, b) => a.displayOrder - b.displayOrder);
  const displayList = sorted.slice(0, 3);

  return (
    <section className="py-20 sm:py-28 border-t border-slate-900 bg-slate-950/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Career History"
          title="Professional Journey"
          subtitle="Proven track record of engineering leadership, scalable software delivery, and architectural innovation"
        />

        {displayList.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Experience Timeline"
            description="Career timeline details are being prepared via the CMS backend."
          />
        ) : (
          <div className="space-y-12 max-w-4xl mx-auto">
            {/* Timeline Container */}
            <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-10">
              {displayList.map((item, idx) => {
                const formattedStart = formatDate(item.startDate);
                const formattedEnd = item.current ? 'Present' : formatDate(item.endDate);
                const isCurrent = !!item.current;

                return (
                  <div key={item.id || idx} className="relative group">
                    {/* Glowing Node on Timeline */}
                    <div
                      className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 border-2 border-indigo-400 ring-4 ring-indigo-500/20 text-white shadow-lg shadow-indigo-600/40'
                          : 'bg-slate-900 border-2 border-slate-700 text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-400'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>

                    {/* Timeline Content Card */}
                    <div
                      className={`p-6 sm:p-8 rounded-3xl backdrop-blur-xl transition-all space-y-4 ${
                        isCurrent
                          ? 'bg-gradient-to-b from-indigo-950/25 via-slate-900/80 to-slate-950 border border-indigo-500/30 shadow-xl shadow-indigo-950/30'
                          : 'bg-slate-900/60 border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                              {item.position}
                            </h3>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                                Current Role
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
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
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                          {item.description}
                        </p>
                      )}

                      {Array.isArray(item.technologies) && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
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

            <div className="text-center pt-2">
              <Link
                href="/experience"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-sm font-semibold transition-all hover:border-indigo-500/40 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <span>View Comprehensive Experience Timeline</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
