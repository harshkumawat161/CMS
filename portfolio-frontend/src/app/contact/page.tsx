import React from 'react';
import type { Metadata } from 'next';
import portfolioApi from '@/lib/api';
import SectionHeading from '@/components/ui/SectionHeading';
import ContactForm from '@/components/contact/ContactForm';
import { Mail, MapPin, Clock, MessageSquareCode, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Project Collaboration',
  description:
    'Reach out for architecture consulting, full-stack software development, or technical inquiries.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact & Project Collaboration | Alexander Sterling',
    description:
      'Reach out for architecture consulting, full-stack software development, or technical inquiries.',
    url: '/contact',
    type: 'website',
  },
};

export default async function ContactPage() {
  const about = await portfolioApi.getAbout();

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in space-y-16">
      <SectionHeading
        badge="Initiate Conversation"
        title="Get In Touch"
        subtitle="Have a challenging technical problem, prospective engagement, or architectural question? Send a message below."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquareCode className="w-5 h-5 text-indigo-400" />
              <span>Direct Coordinates</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Messages submitted here are routed directly to the CMS backend inquiry queue. You can also reach out via email.
            </p>

            <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-300">
              {about?.email && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <Mail className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${about.email}`}
                      className="font-semibold text-white hover:text-indigo-300 transition-colors"
                    >
                      {about.email}
                    </a>
                  </div>
                </div>
              )}

              {about?.location && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Location & Timezone
                    </span>
                    <span className="font-semibold text-white">
                      {about.location}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <Clock className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Response Window
                  </span>
                  <span className="font-semibold text-white">
                    Typically within 24 to 48 hours
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Consulting Availability
            </h4>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Accepting select client engagements</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
