'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 pt-16 pb-12 text-slate-300 relative overflow-hidden">
      {/* Decorative top blur glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-xl"
              aria-label="DevPortfolio Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-md shadow-indigo-600/30">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                DevPortfolio<span className="text-indigo-400">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Full-Stack Developer & Software Architect crafting high-performance,
              resilient digital platforms with modern web standards and enterprise microservices.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Available for opportunities & consulting</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors focus-visible:underline focus-visible:outline-none"
                >
                  About & Background
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors focus-visible:underline focus-visible:outline-none"
                >
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/skills"
                  className="hover:text-white transition-colors focus-visible:underline focus-visible:outline-none"
                >
                  Technical Stack
                </Link>
              </li>
              <li>
                <Link
                  href="/experience"
                  className="hover:text-white transition-colors focus-visible:underline focus-visible:outline-none"
                >
                  Work Timeline
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors focus-visible:underline focus-visible:outline-none"
                >
                  Consulting Services
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors focus-visible:underline focus-visible:outline-none"
                >
                  Articles & Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Get In Touch
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors text-indigo-400 font-semibold focus-visible:underline focus-visible:outline-none"
                >
                  <span>Direct Message Form</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 focus-visible:underline focus-visible:outline-none"
                  aria-label="GitHub Profile (opens in new tab)"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub Profile</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 focus-visible:underline focus-visible:outline-none"
                  aria-label="LinkedIn Profile (opens in new tab)"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>LinkedIn Network</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} DevPortfolio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Backed by</span>
              <span className="text-white font-medium">Spring Boot CMS API</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
