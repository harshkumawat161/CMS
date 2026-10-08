# CMS

Full-Stack Developer Portfolio & Content Management System.

A comprehensive multi-tier application ecosystem comprising:
1. **[portfolio-backend](portfolio-backend/)**: Enterprise Spring Boot 3 + Spring Data JPA + PostgreSQL REST API.
2. **[portfolio-cms](portfolio-cms/)**: React 19 + Vite 8 administrative management dashboard with JWT authentication.
3. **[portfolio-frontend](portfolio-frontend/)**: Next.js 16 App Router public developer portfolio experience.

---

## 🏛 System Architecture

```text
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     Public Portfolio (Next.js)  │       │       CMS Admin (Vite / React)  │
│      https://yourportfolio.com  │       │   https://admin.yourportfolio.com│
└────────────────┬────────────────┘       └────────────────┬────────────────┘
                 │                                         │
                 │ Public GET endpoints                    │ HTTPS REST + Admin JWT
                 ▼                                         ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       Spring Boot REST API Layer                          │
│                                                                           │
│  • Spring Security 6 & JWT Filter (HMAC-SHA512 Token Authentication)       │
│  • Global Exception Handler & Input Validation (JSR-380 / Bean Validation)│
│  • CORS Whitelisting & Secure Headers                                     │
│  • REST Controllers: Auth, About, Skills, Projects, Blogs, Media, Contact│
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                  PostgreSQL 16 Relational Database                        │
│                                                                           │
│  • HikariCP High-Performance Connection Pooling                           │
│  • ACID Compliant Storage: users, projects, blogs, media, messages, etc.  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Subdirectories

- **`portfolio-backend/`**: Java 21, Spring Boot 3.3.4, Hibernate, PostgreSQL, JWT HMAC-SHA512 auth, OpenAPI Swagger documentation.
- **`portfolio-cms/`**: React 19, Vite, Tailwind CSS, protected routes, project/blog/media/message management.
- **`portfolio-frontend/`**: Next.js 16 App Router, TypeScript, dynamic SEO, responsive UI, accessible contact form.
- **`DEPLOYMENT.md`**: Complete production deployment guide for Railway, Render, Vercel, Netlify, and Docker Compose.
- **`docker-compose.yml`**: Full-stack multi-container orchestration.

---

## 🚀 Quick Start (Local Development)

### 1. Backend
```bash
cd portfolio-backend
./mvnw clean spring-boot:run
```
API runs on `http://localhost:8080` (Swagger UI at `/swagger-ui.html`).

### 2. CMS Admin Dashboard
```bash
cd portfolio-cms
npm install
npm run dev
```
CMS runs on `http://localhost:5173`.

### 3. Public Portfolio
```bash
cd portfolio-frontend
npm install
npm run dev
```
Public portfolio runs on `http://localhost:3000`.

---

## 📄 License
This project is licensed under the MIT License.
