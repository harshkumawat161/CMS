import React from 'react';
import type { Metadata } from 'next';
import portfolioApi from '@/lib/api';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { Wrench, CheckCircle2, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Skills & Technical Competencies',
  description:
    'In-depth breakdown of technical proficiencies, engineering tools, and systems architectures.',
  alternates: {
    canonical: '/skills',
  },
  openGraph: {
    title: 'Skills & Technical Competencies | Alexander Sterling',
    description:
      'In-depth breakdown of technical proficiencies, engineering tools, and systems architectures.',
    url: '/skills',
    type: 'website',
  },
};

export default async function SkillsPage() {
  const allSkills = await portfolioApi.getSkills();
  const publishedSkills = allSkills.filter((s) => s.published !== false);

  const categories = Array.from(
    new Set(publishedSkills.map((s) => s.category || 'General'))
  );

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in space-y-16">
      <SectionHeading
        badge="Technical Expertise"
        title="Skills & Tooling Architecture"
        subtitle="Full spectrum of languages, cloud infrastructures, frameworks, and data stores leveraged across production applications"
      />

      {publishedSkills.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="Skills Inventory Updating"
          description="The technical skills catalog is being synchronized via the CMS."
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
                  className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between space-y-6"
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {cat}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                        {categorySkills.length} Techs
                      </span>
                    </div>

                    <div className="space-y-5">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="space-y-2">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-semibold text-slate-200">
                              {skill.name}
                            </span>
                            <span className="font-mono text-xs text-slate-400">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.max(0, skill.proficiency))}%`,
                              }}
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
        </div>
      )}
    </div>
  );
}
