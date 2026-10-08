# Public Developer Portfolio — Next.js 16 App Router Experience

[![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A state-of-the-art, high-performance developer portfolio built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed with rich aesthetics, fluid animations, full accessibility (WCAG 2.1 AA), and zero hardcoded content—every project, blog post, skill, and testimonial is rendered dynamically from the Spring Boot CMS backend.

---

## 🏛 Architecture & Data Flow

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                    Public Portfolio UI (Next.js 16)                       │
│                                                                           │
│  • Next.js App Router (Server & Client Component Architecture)            │
│  • Dynamic SEO Engine: sitemap.ts, robots.ts, Open Graph, Twitter Cards    │
│  • Responsive Design System: Glassmorphism, Tailwind CSS, Lucide Icons   │
│  • Accessible Forms & Interactive Elements (WCAG 2.1 AA Compliance)       │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼ HTTPS REST Client (api.ts / Axios)
┌───────────────────────────────────────────────────────────────────────────┐
│                        Spring Boot CMS Backend API                        │
│                                                                           │
│  GET  /api/about          → Profile biography, headline, coordinates      │
│  GET  /api/skills         → Technical skills matrix with ratings          │
│  GET  /api/projects       → Published portfolio builds and case studies   │
│  GET  /api/projects/{slug}→ Detailed architecture specifications          │
│  GET  /api/blogs          → Published engineering articles (newest first) │
│  GET  /api/blogs/{slug}   → Formatted article content and metadata        │
│  GET  /api/experience     → Vertical career timeline with technology tags │
│  GET  /api/services       → Technical consulting models and capabilities  │
│  GET  /api/testimonials   → Peer reviews and client endorsements          │
│  POST /api/contact        → Real-time inquiry delivery to CMS queue       │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 📸 Portfolio UI Showcase

### 1. Hero & Navigation (`/`)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ ✦ ALEXANDER STERLING     About   Projects   Skills   Experience   Blog   Contact   [ Resume ↗ ]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  🟢 Available for select architectural consulting engagements                               │
│                                                                                             │
│  Architecting High-Throughput Distributed Systems                                           │
│  & Scalable Cloud Platforms                                                                 │
│                                                                                             │
│  Specializing in event-driven microservices, Kubernetes orchestration, and enterprise       │
│  software reliability. Leading cross-functional teams to build resilient platforms.        │
│                                                                                             │
│  [ Explore Featured Projects → ]      [ Get In Touch ✉ ]                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Featured Projects (`/projects`)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ ★ FEATURED BUILD                                                                            │
│ ┌─────────────────────────────────────────┐  Distributed Event Broker                       │
│ │                                         │  High-throughput Kafka streaming pipeline with  │
│ │         [ Architecture Diagram ]        │  automated partition rebalancing and consensus. │
│ │                                         │                                                 │
│ └─────────────────────────────────────────┘  [ Java ]  [ Spring Boot ]  [ Kafka ]  [ Docker]│
│                                              [ Live Demo ↗ ]            [ Source Code ↗ ]   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Career Timeline (`/experience`)
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  2023 - Present  •  Lead Cloud Infrastructure Architect @ Vanguard Systems Lab [🟢 Active] │
│  │                  Directed cloud transformation across multi-tenant Kubernetes clusters.  │
│  │                  [ Kubernetes ] [ Go ] [ Terraform ] [ Prometheus ]                     │
│  │                                                                                          │
│  2021 - 2023     •  Senior Backend Systems Engineer @ Meridian Data Systems                 │
│                     Designed event streaming brokers handling 150k msg/sec throughput.      │
│                     [ Spring Boot ] [ Java ] [ Apache Kafka ] [ PostgreSQL ]                │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

- **Dynamic CMS Integration**: Content is decoupled and served directly from the Spring Boot CMS API. Zero mock data.
- **Visual Design**: Sleek dark aesthetic (`slate-950` to `indigo-500` accents), responsive clamp typography, glowing card borders, and smooth micro-interactions.
- **Projects Showcase**: Semantic `<article>` cards, tag filters, featured project emphasis with halo glows, and individual case studies (`/projects/[slug]`).
- **Editorial Engineering Blog**: Paginated article listings, estimated reading times, publication badges, and responsive article detail pages (`/blog/[slug]`) with clipboard share buttons.
- **Connected Contact Form**: Real-time form with field-level client validation, backend validation error mapping, submission concurrency locking, and status feedback.
- **Production SEO & Discovery**: Next.js Metadata API with Open Graph tags, Twitter summary cards, dynamic XML sitemap generation (`/sitemap.xml`), and robots policy (`/robots.txt`).
- **Accessibility (WCAG 2.1 AA)**: Screen-reader skip navigation link, semantic heading hierarchy, `role="progressbar"`, visible focus rings (`focus-visible:ring-2`), and descriptive alt attributes.
- **Responsive Layout**: Designed for mobile (drawer menu with backdrop blur and Escape key listener), tablet, and desktop viewports without layout shifts or horizontal overflow.

---

## 🛠 Tech Stack

- **Framework**: Next.js `16.4` (Turbopack, App Router)
- **Library**: React `19.2` (Server & Client Components)
- **Language**: TypeScript `5`
- **Styling**: Tailwind CSS `3.4`, PostCSS, Autoprefixer
- **HTTP Client**: Axios `1.20`
- **Iconography**: Lucide React + Custom SVG Icons

---

## 📂 Repository Folder Structure

```text
portfolio-frontend/
├── public/                     # Static media and favicons
├── src/
│   ├── app/                    # Next.js App Router Structure
│   │   ├── about/              # /about profile page
│   │   ├── blog/               # /blog listing page
│   │   │   └── [slug]/         # /blog/[slug] dynamic article page
│   │   ├── contact/            # /contact page with connected inquiry form
│   │   ├── experience/         # /experience career timeline page
│   │   ├── projects/           # /projects catalog page
│   │   │   └── [slug]/         # /projects/[slug] dynamic case study page
│   │   ├── services/           # /services consulting capabilities page
│   │   ├── skills/             # /skills competencies matrix page
│   │   ├── layout.tsx          # Root layout with Open Graph metadata & skip link
│   │   ├── page.tsx            # Home page aggregating all portfolio sections
│   │   ├── robots.ts           # Dynamic robots.txt generation
│   │   ├── sitemap.ts          # Dynamic XML sitemap generator
│   │   └── globals.css         # Theme tokens, utilities, and animations
│   ├── components/
│   │   ├── blog/               # ShareButton.tsx and blog article helpers
│   │   ├── contact/            # ContactForm.tsx with validation & feedback
│   │   ├── home/               # HeroSection, FeaturedProjects, ExperienceSection, etc.
│   │   ├── layout/             # Navbar.tsx (with mobile drawer) and Footer.tsx
│   │   └── ui/                 # SectionHeading, LoadingSkeleton, Icons.tsx
│   ├── lib/
│   │   ├── api.ts              # Centralized portfolio API client
│   │   └── utils.ts            # Formatting, reading time, and URL normalization
│   └── types/
│       └── portfolio.ts        # TypeScript interfaces matching backend DTOs
├── .env.example                # Public environment variable template
├── .gitignore                  # Git ignore rules
├── Dockerfile                  # Multi-stage production container
├── next.config.ts              # Next.js config with image remote patterns
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # TypeScript compiler rules
└── README.md                   # Repository documentation
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js 18 or 20+** (`node -v`)
- **npm** or **yarn** or **pnpm**
- **Spring Boot Backend running** on `http://localhost:8080`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/yourusername/portfolio-frontend.git
cd portfolio-frontend

# Install dependencies
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Ensure `NEXT_PUBLIC_API_URL` points to your Spring Boot API:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Start Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔑 Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:8080` | URL of the running Spring Boot CMS backend |

---

## 🚢 Production Deployment

### Option A: Vercel (Recommended)
1. Import repository into Vercel.
2. Framework Preset: **Next.js**.
3. In Environment Variables, set:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourportfolio.com
   ```
4. Click **Deploy**.
5. Connect your domain: `yourportfolio.com`.

### Option B: Netlify
1. Connect repository to Netlify.
2. Set build command: `npm run build` | publish directory: `.next`.
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://api.yourportfolio.com`.

### Option C: Docker Container
```bash
# Build production image
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.yourportfolio.com -t portfolio-frontend:latest .

# Run container
docker run -d --name portfolio-frontend -p 3000:3000 portfolio-frontend:latest
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
