import React from 'react';
import Link from 'next/link';
import { Skill } from '@/types/portfolio';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowRight, Wrench } from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const publishedSkills = skills.filter((s) => s.published !== false);

  const categories = Array.from(
    new Set(publishedSkills.map((s) => s.category || 'General'))
  );

  return (
    <section className="py-20 sm:py-28 border-t border-slate-900 bg-slate-950/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Core Stack"
          title="Skills & Technical Mastery"
          subtitle="A battle-tested repertoire of programming languages, frameworks, cloud services, and architectures"
        />

        {publishedSkills.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="Skills Inventory Updating"
            description="The technical skills catalog is currently being populated via the CMS."
          />
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => {
                const categorySkills = publishedSkills
                  .filter((s) => (s.category || 'General') === cat)
                  .sort((a, b) => a.displayOrder - b.displayOrder);

                return (
                  <div
                    key={cat}
                    className="p-7 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between shadow-xl hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {cat}
                        </h3>
                        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                          {categorySkills.length} Techs
                        </span>
                      </div>

                      <div className="space-y-4">
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-200">
                                {skill.name}
                              </span>
                              <span className="font-mono text-slate-400">
                                {skill.proficiency}%
                              </span>
                            </div>
                            <div
                              className="w-full h-2 rounded-full bg-slate-800 overflow-hidden"
                              role="progressbar"
                              aria-valuenow={skill.proficiency}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`Proficiency in ${skill.name}`}
                            >
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(0, skill.proficiency))}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/skills"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-sm font-semibold transition-all hover:border-indigo-500/40 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <span>Explore Full Technical Breakdown</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
