import React from 'react';
import Link from 'next/link';
import { ServiceItem } from '@/types/portfolio';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const published = services
    .filter((s) => s.published !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-20 sm:py-28 border-t border-slate-900 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Specializations"
          title="Services & Architecture Consulting"
          subtitle="Comprehensive engineering capabilities designed to accelerate technology roadmaps and production velocity"
        />

        {published.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Services Catalog"
            description="Consulting offerings are being scheduled and updated via the CMS."
          />
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {published.slice(0, 6).map((service) => (
                <div
                  key={service.id}
                  className="p-7 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      <Sparkles className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-800/60">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-md py-1"
                    >
                      <span>Inquire About Scope</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-sm font-semibold transition-all hover:border-indigo-500/40 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <span>View All Services & Delivery Models</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
