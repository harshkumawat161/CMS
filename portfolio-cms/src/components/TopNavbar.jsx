import React from 'react';
import { Menu, ExternalLink } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const TopNavbar = ({ onToggleSidebar }) => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return 'System Overview & Analytics';
      case '/about':
        return 'About & Profile Information';
      case '/skills':
        return 'Skills & Technical Proficiencies';
      case '/projects':
        return 'Projects & Showcase Portfolio';
      case '/blogs':
        return 'Articles & Blog Publications';
      case '/experience':
        return 'Career & Work Experience';
      case '/testimonials':
        return 'Client & Colleague Testimonials';
      case '/services':
        return 'Provided Services & Offerings';
      case '/media':
        return 'Media Asset Storage & Library';
      case '/messages':
        return 'Contact Inquiries & Messages';
      default:
        return 'CMS Administration';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
              Admin Portal
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400 font-medium">Live Management</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* API Health badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>API Connected (Port 8080)</span>
        </div>

        {/* Swagger link */}
        <a
          href="http://localhost:8080/swagger-ui/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-colors"
          title="Open OpenAPI Swagger Docs"
        >
          <span>Swagger UI</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>
    </header>
  );
};

export default TopNavbar;
