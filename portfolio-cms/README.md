# Portfolio CMS Admin Dashboard — Content Management System

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.18-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A state-of-the-art, secure administrative dashboard designed for developers to manage their public portfolio content, articles, projects, uploaded media, and prospective client inquiries in real time.

---

## 🏛 Architecture & Security Flow

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                       CMS Admin UI (React / Vite SPA)                     │
│                                                                           │
│  • Responsive Sidebar & Navigation                                        │
│  • Protected Route Guards (AuthContext & LocalStorage Token State)        │
│  • Centralized Axios API Client with Auto-Refresh Queue Interceptors      │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼ HTTPS Requests with JWT
┌───────────────────────────────────────────────────────────────────────────┐
│                    JWT Authorization & Token Lifecycle                    │
│                                                                           │
│  • Authorization: Bearer <accessToken> (HMAC-SHA512)                       │
│  • 401 Interceptor: Automatically pauses requests, calls /api/auth/refresh│
│  • Atomic Token Rotation & Seamless Request Re-dispatch                   │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼ Verified Admin Authority (ROLE_ADMIN)
┌───────────────────────────────────────────────────────────────────────────┐
│                        Spring Boot REST API Layer                         │
│                                                                           │
│  • /api/admin/projects       • /api/admin/blogs       • /api/admin/media │
│  • /api/admin/experience     • /api/admin/skills      • /api/admin/about │
│  • /api/admin/testimonials   • /api/admin/services    • /api/admin/messages
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 📸 Dashboard Preview

### Executive Management Console
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ ✦ CMS Admin Console        [ 🔍 Search repository... ]            (Alexander Sterling) [🚪] │
├──────────────┬──────────────────────────────────────────────────────────────────────────────┤
│ 📊 Dashboard │  [ 📁 Projects ]     [ ✍️ Articles ]     [ 🖼️ Media Assets ]   [ 📬 Inquiries ]│
│ 👤 About Me  │       12 Active             8 Published            24 Assets           3 Unread  │
│ 🛠 Skills     ├──────────────────────────────────────────────────────────────────────────────┤
│ 🚀 Projects  │  RECENT CONTACT INQUIRIES                                                    │
│ 📝 Blogs     │  • Elena Rostova      | elena@vanguard-cloud.io   | Data Mesh Consulting  [View]│
│ 💼 Experience│  • Marcus Vance      | marcus.vance@techcorp.io  | Cloud Migration Adv.  [View]│
│ 🌟 Testimon. ├──────────────────────────────────────────────────────────────────────────────┤
│ ⚙️ Services   │  MEDIA ASSETS & PREVIEWS                                                     │
│ 🖼️ Media     │  [ k8s-autoscaler.png ]  [ event-broker-arch.webp ]  [ profile-photo.jpg ]     │
│ 📬 Messages  │  [ + Upload New Media ]  [ Copy Public CDN URL ]     [ Delete Asset ]         │
└──────────────┴──────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

- **Authenticated Admin Console**: Secure login screen with credential validation, automatic JWT refresh, and protected route redirection.
- **Projects Showcase CMS**: Complete CRUD with custom URL slug generation, featured status toggling, technology tag badges, and one-click Publish / Unpublish actions.
- **Editorial Blog Management**: Article editor with Markdown support, tag categorization, estimated reading time metrics, and publish lifecycle control.
- **Media Asset Library**: Drag-and-drop file upload with MIME verification, image lightbox preview, copy-to-clipboard public URL helper, and safe disk deletion.
- **Interactive Contact Inbox**: View incoming client inquiries, mark messages as read/unread, and purge resolved inquiries.
- **Profile & Resume Customization**: Instant updates to owner biography, headline, downloadable resume URL, location, and social media handles.
- **Reusable UX Components**: Built with customizable loading skeletons, toast notifications, confirmation modals, pagination controls, and empty state fallbacks.

---

## 🛠 Tech Stack

- **Framework**: React `19.2`
- **Build Tool**: Vite `8.3` (Fast HMR & Optimized Rollup/Rolldown Bundling)
- **Routing**: React Router DOM `7.18`
- **Styling**: Tailwind CSS `3.4`, PostCSS, Autoprefixer
- **HTTP Client**: Axios `1.20` with Request/Response Interceptors
- **Iconography**: Lucide React
- **Linter**: Oxlint `1.81`

---

## 📂 Repository Folder Structure

```text
portfolio-cms/
├── public/
│   └── _redirects              # Netlify & Cloudflare SPA rewrite rule
├── src/
│   ├── components/             # Reusable UI Controls
│   │   ├── ConfirmModal.jsx    # Deletion safety dialogs
│   │   ├── EmptyState.jsx      # Empty collection fallbacks
│   │   ├── ErrorState.jsx      # Network error recovery screens
│   │   ├── LoadingState.jsx    # Pulsing skeletons & spinners
│   │   ├── MediaPicker.jsx     # Reusable image selector for forms
│   │   ├── Modal.jsx           # Generic accessible dialog container
│   │   └── Pagination.jsx     # Server/client pagination buttons
│   ├── context/
│   │   ├── AuthContext.jsx     # User state, login, logout & token storage
│   │   └── ToastContext.jsx    # Non-blocking notification toasts
│   ├── layouts/
│   │   ├── AdminLayout.jsx     # Sidebar, header & main container
│   │   └── AuthLayout.jsx      # Clean centered login view
│   ├── pages/
│   │   ├── about/              # Profile editor
│   │   ├── auth/               # LoginPage.jsx
│   │   ├── blogs/              # Blog listing & editor
│   │   ├── dashboard/          # Metric counters & recent activity
│   │   ├── experience/         # Career timeline manager
│   │   ├── media/              # Media library & upload view
│   │   ├── messages/           # Contact inquiry management
│   │   ├── projects/           # Projects grid & form modals
│   │   ├── services/           # Consulting offerings CRUD
│   │   ├── skills/             # Technical competencies table
│   │   └── testimonials/       # Client reviews manager
│   ├── services/
│   │   ├── api.js              # Central Axios client with JWT refresh queue
│   │   ├── authService.js      # Auth API endpoints
│   │   ├── blogService.js      # Blog endpoints
│   │   ├── mediaService.js     # Multipart upload endpoints
│   │   ├── messageService.js   # Inquiry endpoints
│   │   └── projectService.js   # Project endpoints
│   ├── utils/
│   │   └── formatters.js       # Date formatting and byte size helpers
│   ├── App.jsx                 # Route definitions & ProtectedRoute wrappers
│   ├── index.css               # Tailwind CSS base and theme rules
│   └── main.jsx                # React root hydration
├── .env.example                # Environment variable documentation
├── .gitignore                  # Git ignore rules
├── Dockerfile                  # Production Nginx SPA Docker container
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind theme and custom colors
├── vercel.json                 # Vercel SPA rewrite rule
├── vite.config.js              # Vite React configuration
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
git clone https://github.com/yourusername/portfolio-cms.git
cd portfolio-cms

# Install packages
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Ensure `.env` points to your backend instance:
```env
VITE_API_URL=http://localhost:8080
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.
Log in using your seeded admin credentials:
- **Email**: `admin@portfolio.local`
- **Password**: `Admin@123456`

---

## 🔑 Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Yes | `http://localhost:8080` | Target base URL for the Spring Boot backend API |

---

## 🚢 Production Deployment

### Option A: Vercel (Recommended)
1. Import repository into Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build` | Output Directory: `dist`.
4. Environment Variables:
   - `VITE_API_URL`: `https://api.yourportfolio.com`
5. Custom Domain: `admin.yourportfolio.com`.
*(Note: [vercel.json](vercel.json) is already included to prevent 404 errors on route reloads).*

### Option B: Netlify
1. Import repository into Netlify.
2. Build command: `npm run build` | Publish directory: `dist`.
3. Set environment variable: `VITE_API_URL=https://api.yourportfolio.com`.
*(Note: [public/_redirects](public/_redirects) is already included for SPA rewrites).*

### Option C: Docker Container with Nginx
```bash
# Build production Docker image
docker build --build-arg VITE_API_URL=https://api.yourportfolio.com -t portfolio-cms:latest .

# Run container on port 80 (or mapped port 5173)
docker run -d --name portfolio-cms -p 5173:80 portfolio-cms:latest
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
