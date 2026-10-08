# Portfolio CMS Platform - Complete Production Deployment Manual

This document provides step-by-step instructions for deploying the complete full-stack portfolio system:
- **Public Portfolio Frontend** (`Next.js 16` on Vercel / Netlify)
- **CMS Admin Dashboard** (`React / Vite SPA` on Vercel / Netlify / Cloudflare Pages)
- **Backend REST API** (`Spring Boot 3` on Render / Railway / Docker VPS)
- **Database** (`PostgreSQL 16` on Neon / Supabase / AWS RDS / Railway / Render)

---

## 1. Production Architecture & Domain Layout

```text
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     Public Portfolio UI         │       │        CMS Admin Dashboard      │
│  https://yourportfolio.com      │       │   https://admin.yourportfolio.com│
└────────────────┬────────────────┘       └────────────────┬────────────────┘
                 │                                         │
                 │ HTTPS REST API requests                 │ HTTPS REST + Admin JWT
                 ▼                                         ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          Spring Boot 3 Backend API                        │
│                         https://api.yourportfolio.com                     │
│               (CORS Allowed: yourportfolio.com, admin.yourportfolio.com)   │
└───────────────────────┬───────────────────────────┬───────────────────────┘
                        │                           │
                        ▼                           ▼
        ┌──────────────────────────────┐    ┌───────────────────────────────┐
        │       PostgreSQL 16          │    │     Media Storage Layer       │
        │      Production DB           │    │  Persistent Volume / AWS S3   │
        └──────────────────────────────┘    └───────────────────────────────┘
```

---

## 2. Master Environment Variables Matrix

### A. Spring Boot Backend (`SPRING_PROFILES_ACTIVE=prod`)

| Environment Variable | Required | Example / Recommended Value | Description |
| :--- | :---: | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | **YES** | `prod` | Activates production profile (`application-prod.yml`) |
| `PORT` | NO | `8080` | Port bound by container / web host |
| `DATABASE_URL` | **YES** | `jdbc:postgresql://postgres.railway.internal:5432/railway` | PostgreSQL JDBC connection URL |
| `DATABASE_USERNAME` | **YES** | `postgres` | Database user |
| `DATABASE_PASSWORD` | **YES** | `YourStrongDbPass#2026` | Database password |
| `JWT_SECRET` | **YES** | `64_HEX_OR_BASE64_SECURE_RANDOM_KEY` | HMAC-SHA512 signing secret (min 64 bytes) |
| `JWT_ACCESS_EXPIRATION_MS` | NO | `86400000` (24h) | Access token lifetime in milliseconds |
| `JWT_REFRESH_EXPIRATION_MS` | NO | `604800000` (7d) | Refresh token lifetime in milliseconds |
| `CORS_ALLOWED_ORIGINS` | **YES** | `https://yourportfolio.com,https://admin.yourportfolio.com` | Strict comma-separated allowed origins (no trailing slashes, no wildcards) |
| `STORAGE_TYPE` | NO | `local` | `local` (filesystem volume) or `s3` (AWS S3) |
| `STORAGE_LOCAL_PATH` | NO | `/var/data/uploads` | Persistent directory path for media assets |
| `CONTACT_NOTIFICATION_EMAIL` | NO | `alex@yourportfolio.com` | Target inbox for contact form submissions |
| `SMTP_HOST` | NO | `smtp.resend.com` or `smtp.sendgrid.net` | Outgoing SMTP host for email dispatch |
| `SMTP_PORT` | NO | `587` | Outgoing SMTP TLS port |
| `SMTP_USERNAME` | NO | `apikey` | SMTP credentials |
| `SMTP_PASSWORD` | NO | `re_your_api_key_here` | SMTP credentials |
| `SEED_ADMIN` | NO | `false` | Set `true` only on first run if seeding initial admin |
| `ADMIN_EMAIL` | NO | `admin@yourportfolio.com` | Initial admin account email |
| `ADMIN_PASSWORD` | NO | `GenerateSecurePassphrase2026!` | Initial admin account password |

> [!CRITICAL]
> Generate a strong 64-byte random string for `JWT_SECRET`. Example command:
> ```bash
> openssl rand -hex 64
> ```

---

### B. Public Portfolio Frontend (`portfolio-frontend`)

| Environment Variable | Required | Example Value | Description |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | **YES** | `https://api.yourportfolio.com` | Base URL of the Spring Boot backend |

---

### C. CMS Admin Dashboard (`portfolio-cms`)

| Environment Variable | Required | Example Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **YES** | `https://api.yourportfolio.com` | Base URL of the Spring Boot backend |

---

## 3. Database Deployment (PostgreSQL 16)

### Option 1: Managed Database (Neon / Supabase / Railway / Render)
1. Create a new PostgreSQL 16 database instance.
2. Note the connection details:
   - Host: e.g. `ep-soft-voice-1234.us-east-2.aws.neon.tech`
   - Database: `portfolio_db`
   - User: `portfolio_user`
   - Password: `[Secure_Password]`
   - Port: `5432`
3. Formulate the JDBC connection string:
   ```text
   jdbc:postgresql://ep-soft-voice-1234.us-east-2.aws.neon.tech:5432/portfolio_db?sslmode=require
   ```

### Schema Lifecycle
- Hibernate is configured with `spring.jpa.hibernate.ddl-auto: update` by default in `application-prod.yml`.
- On first startup against an empty database, Hibernate automatically creates all tables, indexes, and constraints.
- Once the schema is established, you can optionally lock it down by passing `JPA_DDL_AUTO=validate`.

---

## 4. Spring Boot Backend Deployment

### Option A: Deploy on Railway (Recommended)
1. In the Railway dashboard, select **New Project** → **Deploy from GitHub repo**.
2. Point to the repository and set the root directory to `/backend`.
3. Railway automatically detects the provided [backend/Dockerfile](file:///c:/Users/ronak/Desktop/CMS/backend/Dockerfile).
4. Add a **Persistent Volume** in the Railway service settings:
   - Mount Path: `/var/data/uploads`
5. Under **Variables**, add:
   ```env
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://your-db-host:5432/portfolio_db
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_db_password
   JWT_SECRET=your_generated_64_byte_hex_secret
   CORS_ALLOWED_ORIGINS=https://yourportfolio.com,https://admin.yourportfolio.com
   STORAGE_LOCAL_PATH=/var/data/uploads
   SEED_ADMIN=true
   ADMIN_EMAIL=admin@yourportfolio.com
   ADMIN_PASSWORD=YourChosenAdminPass123!
   ```
6. Under **Settings**, generate a domain or attach a custom domain (e.g. `api.yourportfolio.com`).

---

### Option B: Deploy on Render
1. In Render, select **New** → **Web Service**.
2. Connect your repository.
3. Configure:
   - **Environment**: `Docker`
   - **Docker Context**: `./backend`
   - **Docker Command**: Leave default (uses `Dockerfile`)
4. Add a **Disk** under the service's Disks tab:
   - Name: `portfolio-media`
   - Mount Path: `/var/data/uploads`
   - Size: `10 GB` (or desired capacity)
5. Set the Environment Variables listed in the Matrix above.
6. Attach custom domain `api.yourportfolio.com`.

---

## 5. Public Portfolio Deployment (Next.js on Vercel)

1. Navigate to [Vercel](https://vercel.com/) → **Add New Project**.
2. Select your repository.
3. In Project Settings:
   - **Root Directory**: `portfolio-frontend`
   - **Framework Preset**: `Next.js`
4. In **Environment Variables**, add:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourportfolio.com
   ```
5. Click **Deploy**.
6. Under **Domains**, add your custom domain:
   - `yourportfolio.com` and `www.yourportfolio.com`
7. Update your DNS provider with the CNAME / A records provided by Vercel.

---

## 6. CMS Admin Dashboard Deployment (Vite on Vercel or Netlify)

### On Vercel:
1. In Vercel, select **Add New Project**.
2. Select your repository.
3. In Project Settings:
   - **Root Directory**: `portfolio-cms`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   ```env
   VITE_API_URL=https://api.yourportfolio.com
   ```
5. Note: The repository includes [portfolio-cms/vercel.json](file:///c:/Users/ronak/Desktop/CMS/portfolio-cms/vercel.json) to handle SPA routing seamlessly on reload.
6. Under **Domains**, add:
   - `admin.yourportfolio.com`

### On Netlify:
1. In Netlify, select **Add new site** → **Import an existing project**.
2. Set base directory to `portfolio-cms`.
3. Build command: `npm run build`, publish directory: `dist`.
4. In Environment variables: `VITE_API_URL=https://api.yourportfolio.com`.
5. Note: The repository includes [portfolio-cms/public/_redirects](file:///c:/Users/ronak/Desktop/CMS/portfolio-cms/public/_redirects) for SPA routing.

---

## 7. Media Storage & Scaling

### A. Local Filesystem with Persistent Volume (Default)
- Files uploaded via the CMS are saved to `${STORAGE_LOCAL_PATH}` (e.g. `/var/data/uploads`).
- Files are served statically by the backend via `GET /uploads/**`.
- Ensure your host (Railway, Render, VPS) has a persistent volume mounted to this path so media survives container restarts.

### B. Scalable Cloud Storage (AWS S3 / Cloudflare R2)
The backend features a decoupled `MediaStorageService` interface. When scaling across multi-node serverless clusters, configure AWS S3 or S3-compatible storage (Cloudflare R2, MinIO):
1. Set `STORAGE_TYPE=s3`
2. Configure AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`).

---

## 8. Self-Hosted VPS Deployment (Docker Compose)

For running the entire stack on an Ubuntu / Debian VPS (e.g. DigitalOcean, Linode, AWS EC2, Hetzner):

1. Clone the repository onto the server.
2. Create `.env` in the project root based on `docker-compose.yml`:
   ```env
   POSTGRES_DB=portfolio_db
   POSTGRES_USER=portfolio_user
   POSTGRES_PASSWORD=generate_strong_db_password
   JWT_SECRET=generate_strong_64_byte_hex_secret
   CORS_ALLOWED_ORIGINS=https://yourportfolio.com,https://admin.yourportfolio.com
   NEXT_PUBLIC_API_URL=https://api.yourportfolio.com
   VITE_API_URL=https://api.yourportfolio.com
   SEED_ADMIN=true
   ADMIN_EMAIL=admin@yourportfolio.com
   ADMIN_PASSWORD=InitialAdminPassword2026!
   ```
3. Start the entire container stack in background mode:
   ```bash
   docker compose up -d --build
   ```
4. Verify running containers:
   ```bash
   docker compose ps
   ```
5. Place Nginx or Caddy in front of the containers for automatic SSL (HTTPS) termination:
   - `yourportfolio.com` → Reverse proxy to `http://localhost:3000`
   - `admin.yourportfolio.com` → Reverse proxy to `http://localhost:5173`
   - `api.yourportfolio.com` → Reverse proxy to `http://localhost:8080`

---

## 9. Pre-Flight Verification Checklist

Before announcing the site live:

- [ ] **HTTPS Enforced**: All domains (`yourportfolio.com`, `admin.yourportfolio.com`, `api.yourportfolio.com`) serve valid SSL/TLS certificates.
- [ ] **CORS Verification**: Sending an `Origin: https://yourportfolio.com` header to `https://api.yourportfolio.com/api/projects` returns `Access-Control-Allow-Origin: https://yourportfolio.com`. An unauthorized origin is rejected.
- [ ] **Admin Authentication**: Log into `https://admin.yourportfolio.com/login` using your admin credentials. Verify JWT generation and dashboard card counters.
- [ ] **Media Upload**: Upload an image through the CMS Media Library. Verify the preview loads and is publicly accessible via HTTPS.
- [ ] **Public Inquiry Verification**: Submit a test message on `https://yourportfolio.com/contact`. Verify the entry appears in the CMS message queue at `https://admin.yourportfolio.com/messages`.
- [ ] **SEO Verification**: Check that `https://yourportfolio.com/robots.txt` and `https://yourportfolio.com/sitemap.xml` return valid HTTP 200 responses.
