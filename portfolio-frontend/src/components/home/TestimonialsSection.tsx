import React from 'react';
import { Testimonial } from '@/types/portfolio';
import { getMediaUrl } from '@/lib/utils';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const published = testimonials
    .filter((t) => t.published !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-20 sm:py-28 border-t border-slate-900 bg-slate-950/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Endorsements"
          title="Peer & Client Testimonials"
          subtitle="Feedback from engineering leaders, project stakeholders, and collaborating architects"
        />

        {published.length === 0 ? (
          <EmptyState
            icon={Quote}
            title="Recommendations"
            description="Client endorsements and peer recommendations are currently being collected."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {published.map((item) => {
              const avatarUrl = item.image ? getMediaUrl(item.image) : null;

              return (
                <figure
                  key={item.id}
                  className="p-7 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between space-y-6 shadow-xl hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Quote className="w-5 h-5" />
                    </div>

                    <blockquote className="text-xs sm:text-sm text-slate-300 italic leading-relaxed font-normal">
                      "{item.message}"
                    </blockquote>
                  </div>

                  {/* Author Row */}
                  <figcaption className="flex items-center gap-3.5 pt-4 border-t border-slate-800/80">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={`Portrait of ${item.name}`}
                        className="w-11 h-11 rounded-full object-cover bg-slate-800 border border-indigo-500/30 shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-500/30 shrink-0">
                        {item.name.charAt(0)}
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-xs text-slate-400">
                        {item.role} {item.company && `at ${item.company}`}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
