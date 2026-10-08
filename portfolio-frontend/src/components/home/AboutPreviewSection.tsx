import React from 'react';
import Link from 'next/link';
import { AboutProfile } from '@/types/portfolio';
import SectionHeading from '@/components/ui/SectionHeading';
import { ArrowRight, Code, Cpu, Layers, ShieldCheck } from 'lucide-react';

interface AboutPreviewSectionProps {
  about: AboutProfile | null;
}

export const AboutPreviewSection: React.FC<AboutPreviewSectionProps> = ({ about }) => {
  const bio =
    about?.bio ||
    'Experienced engineer specialized in architecting scalable services, reactive microservices, and elegant frontend applications. Passionate about clean code, robust test coverage, and continuous delivery pipelines.';

  const HIGHLIGHTS = [
    {
      icon: Cpu,
      title: 'Distributed Systems',
      description: 'Designing fault-tolerant microservices, high-throughput pipelines, and event-driven architectures.',
    },
    {
      icon: Layers,
      title: 'Full-Stack Fluency',
      description: 'Bridging backend Spring Boot services with reactive Next.js and TypeScript user interfaces.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality & Security',
      description: 'Strict adherence to OWASP guidelines, stateless JWT authentication, and automated testing.',
    },
    {
      icon: Code,
      title: 'Clean Architecture',
      description: 'Domain-driven design, maintainable separation of concerns, and reproducible deployments.',
    },
  ];

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Background"
          title="Engineering With Intent"
          subtitle="Delivering reliable software systems engineered to solve real-world complexities"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Story Box */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-5">
            <h3 className="text-xl font-bold text-white tracking-tight">
              About {about?.name || 'My Work'}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {bio}
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-md py-1"
              >
                <span>Read Full Background & Philosophy</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* 4 Feature Highlights */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-indigo-500/30 transition-all hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreviewSection;
