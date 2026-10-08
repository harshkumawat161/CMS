import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import portfolioApi from '@/lib/api';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { Layers, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Consulting Services & Architecture Capabilities',
  description:
    'Specialized software engineering, distributed systems architecture, and technical consulting offerings.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Consulting Services & Architecture Capabilities | Alexander Sterling',
    description:
      'Specialized software engineering, distributed systems architecture, and technical consulting offerings.',
    url: '/services',
    type: 'website',
  },
};

export default async function ServicesPage() {
  const allServices = await portfolioApi.getServices();
  const publishedServices = allServices
    .filter((s) => s.published !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in space-y-16">
      <SectionHeading
        badge="Offerings & Capabilities"
        title="Services & Consulting"
        subtitle="End-to-end technical leadership and engineering execution for modern software platforms"
      />

      {publishedServices.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Services Catalog"
          description="Consulting offerings are being prepared via the CMS backend."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedServices.map((service) => (
            <div
              key={service.id}
              className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {service.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Request Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Engagement Models Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-6 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-white text-center">
          How I Partner With Teams
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white text-sm">Advisory & Architecture</h4>
            <p className="text-slate-400 leading-relaxed">
              System audits, microservices blueprinting, cloud migration roadmaps, and technical debt assessments.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white text-sm">Full-Stack Execution</h4>
            <p className="text-slate-400 leading-relaxed">
              Hands-on development of critical services, APIs, and responsive frontends from prototype to production.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white text-sm">Team Mentorship</h4>
            <p className="text-slate-400 leading-relaxed">
              Upskilling engineering teams on distributed patterns, test automation, and continuous delivery best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
