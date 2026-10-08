import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const viewport: Viewport = {
  themeColor: '#020617',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Alexander Sterling | Principal Software Engineer & Architect',
    template: '%s | Alexander Sterling',
  },
  description:
    'Full-Stack Developer and Distributed Systems Engineer portfolio showcasing production projects, technical competencies, architecture experience, and technical publications.',
  keywords: [
    'Software Engineer',
    'Full-Stack Developer',
    'Distributed Systems',
    'Java',
    'Spring Boot',
    'React',
    'Next.js',
    'TypeScript',
    'Cloud Architecture',
    'Microservices',
  ],
  authors: [{ name: 'Alexander Sterling' }],
  creator: 'Alexander Sterling',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Alexander Sterling — Portfolio',
    title: 'Alexander Sterling | Principal Software Engineer & Architect',
    description:
      'Explore production systems, cloud microservices, and interactive applications built with high standards.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alexander Sterling | Principal Software Engineer & Architect',
    description:
      'Explore production systems, cloud microservices, and interactive applications built with high standards.',
    creator: '@alexander_dev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased h-full scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Accessible Skip To Main Content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 pt-20 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
