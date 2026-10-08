# Portfolio Backend API — Enterprise Spring Boot CMS Engine

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-HMAC--SHA512-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/OpenAPI-Swagger_3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:8080/swagger-ui.html)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

An enterprise-grade, secure, and production-ready RESTful backend engine powering modern developer portfolios and multi-channel content management systems. Built with **Spring Boot 3**, **Spring Security 6**, **Spring Data JPA**, and **PostgreSQL**.

---

## 🏛 Architecture & Data Flow

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
│                        Service & Business Logic                           │
│                                                                           │
│  • Transaction Management (@Transactional)                                │
│  • Media Storage Service (MIME check, UUID generation, Traversal guards)  │
│  • Data Mappers (Entity ↔ Request/Response DTO Projections)              │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          Spring Data JPA Layer                            │
│                                                                           │
│  • Hibernate ORM Entity Management                                        │
│  • Parameterized Repository Queries (Zero SQL Injection)                  │
│  • Schema Constraints & Unique Indexes                                    │
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

## 📸 Screenshots & API Explorer

### Interactive Swagger UI (`/swagger-ui.html`)
The entire API surface is documented with OpenAPI 3.0 specification, complete with schema definitions, request/response payloads, and JWT authorization:

```text
+---------------------------------------------------------------------------------------------------+
|  Swagger.  Portfolio CMS Platform API    v1.0.0                      [ Authorize 🔒 ]            |
|  Comprehensive OpenAPI 3.0 specification for Developer Portfolio & CMS Management                 |
+---------------------------------------------------------------------------------------------------+
| > Authentication    Admin credentials, JWT access and refresh token lifecycle                     |
| > About             Portfolio owner profile, bio, resume, and social links                        |
| > Skills            Technical competencies, taxonomy categories, and proficiency ratings          |
| > Projects          Showcase portfolio builds, slug routing, and case studies                     |
| > Blogs             Articles with draft/published lifecycle and newest-first ordering             |
| > Experience        Professional employment timeline and tech stacks                              |
| > Services          Consulting offerings, architecture capabilities, and models                   |
| > Media             Image asset upload, validation, and static file delivery                      |
| > Contact           Public inquiries queue and CMS administrative notification inbox              |
+---------------------------------------------------------------------------------------------------+
```

---

## ✨ Key Features

- **Robust Authentication & JWT**: Stateless authorization using HMAC-SHA512 signed JWTs with separate Access (24h) and Refresh (7d) token rotation.
- **Role-Based Access Control**: Strict segregation between public visitor `GET` endpoints and protected `/api/admin/**` mutative endpoints requiring `ROLE_ADMIN`.
- **Media Asset Storage**: Secure multi-format image upload (JPEG, PNG, WEBP, safe SVG) with MIME verification, random UUID filename sanitization, and path traversal guards.
- **Enterprise Error Handling**: Centralized `GlobalExceptionHandler` masking technical database/path details while presenting structured field-level validation feedback.
- **Zero SQL Injection**: 100% parameter-bound queries via Spring Data JPA and Hibernate ORM.
- **Comprehensive Test Suite**: 101 unit and integration tests passing with 100% success rate across controllers, security, entities, and services.

---

## 🛠 Tech Stack

- **Framework**: Spring Boot `3.3.4`
- **Language**: Java `21` (Temurin)
- **Security**: Spring Security `6`, JJWT `0.12.6` (io.jsonwebtoken)
- **Data & Persistence**: Spring Data JPA, Hibernate `6.5`, PostgreSQL Driver
- **Connection Pool**: HikariCP
- **Documentation**: Springdoc OpenAPI / Swagger UI `2.6.0`
- **Build Tool**: Apache Maven `3.9` with Maven Wrapper (`./mvnw`)
- **Containerization**: Docker multi-stage build (Alpine Linux runtime)

---

## 📂 Repository Folder Structure

```text
portfolio-backend/
├── .mvn/wrapper/               # Maven wrapper binary & properties
├── src/
│   ├── main/
│   │   ├── java/com/portfolio/
│   │   │   ├── config/         # SecurityConfig, WebMvcConfig, OpenApiConfig, DataInitializer
│   │   │   ├── controller/     # Public & Admin REST Controllers
│   │   │   ├── dto/
│   │   │   │   ├── request/    # JSR-380 Validated Request DTOs
│   │   │   │   └── response/   # Structured API Response Models
│   │   │   ├── exception/      # Custom Exceptions & GlobalExceptionHandler
│   │   │   ├── mapper/         # Entity ↔ DTO Data Transfer Mappers
│   │   │   ├── model/          # JPA Entities (User, Project, Blog, Media, Message, etc.)
│   │   │   │   └── enums/      # Role, ContentStatus, SkillCategory
│   │   │   ├── repository/     # Spring Data JPA Repositories
│   │   │   ├── security/       # JwtUtils, JwtAuthenticationFilter, CustomUserDetails
│   │   │   ├── service/        # Business Logic Interfaces & Implementations
│   │   │   │   └── storage/    # MediaStorageService & LocalStorageServiceImpl
│   │   │   └── util/           # SlugUtils, ValidationUtils
│   │   └── resources/
│   │       ├── application.yml         # Base properties & environment variable bindings
│   │       ├── application-dev.yml     # Local H2 development profile
│   │       ├── application-prod.yml    # Production PostgreSQL profile
│   │       └── application-test.yml    # In-memory test suite configuration
│   └── test/java/com/portfolio/        # 101 Unit and Controller Integration Tests
├── .env.example                # Template for environment variables
├── .gitignore                  # Git ignore rules (ignoring target, .env, uploads)
├── Dockerfile                  # Multi-stage production Docker container definition
├── pom.xml                     # Maven project descriptor & dependencies
└── README.md                   # Repository documentation
```

---

## 🚀 Setup & Installation

### Prerequisites
- **JDK 17 or 21+** (`java -version`)
- **PostgreSQL 16** (or Docker)
- **Git**

### 1. Clone & Configure Environment
```bash
git clone https://github.com/yourusername/portfolio-backend.git
cd portfolio-backend

# Copy environment template
cp .env.example .env
```

### 2. Configure Local Database
Ensure PostgreSQL is running and create the database:
```sql
CREATE DATABASE portfolio_db;
```

Update your `.env` or pass environment variables:
```env
DATABASE_URL=jdbc:postgresql://localhost:5432/portfolio_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_postgres_password
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

### 3. Build & Run Locally
```bash
# Compile and run with Maven Wrapper
./mvnw clean spring-boot:run

# Or run tests
./mvnw test
```

The application starts on `http://localhost:8080`.
Access Swagger UI at `http://localhost:8080/swagger-ui.html`.

---

## 🔑 Environment Variables Reference

| Variable | Required in Prod | Default (Dev) | Description |
| :--- | :---: | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Yes | `dev` | Profile to load (`dev`, `local`, `prod`) |
| `PORT` | No | `8080` | HTTP port |
| `DATABASE_URL` | Yes | `jdbc:postgresql://localhost:5432/portfolio_db` | PostgreSQL JDBC connection URL |
| `DATABASE_USERNAME` | Yes | `postgres` | Database username |
| `DATABASE_PASSWORD` | Yes | `postgres` | Database password |
| `JWT_SECRET` | **YES** | None in Prod | HMAC-SHA512 secret key (min 64 hex chars) |
| `JWT_ACCESS_EXPIRATION_MS` | No | `86400000` (24h) | Access token lifetime in milliseconds |
| `JWT_REFRESH_EXPIRATION_MS`| No | `604800000` (7d) | Refresh token lifetime in milliseconds |
| `CORS_ALLOWED_ORIGINS` | Yes | `http://localhost:3000,http://localhost:5173` | Comma-separated allowed frontend origins |
| `STORAGE_TYPE` | No | `local` | `local` filesystem or `s3` |
| `STORAGE_LOCAL_PATH` | No | `./uploads` | Directory for uploaded media files |
| `SEED_ADMIN` | No | `true` (dev) / `false` (prod) | Auto-seed initial admin account |
| `ADMIN_EMAIL` | No | `admin@portfolio.local` | Initial admin account email |
| `ADMIN_PASSWORD` | No | `Admin@123456` | Initial admin account password |

---

## 📡 REST API Reference

| Method | Endpoint | Access | Summary |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate admin & receive JWT access + refresh tokens |
| `POST` | `/api/auth/refresh` | Public | Exchange refresh token for new access token |
| `GET` | `/api/auth/me` | Admin | Retrieve current authenticated user profile |
| `GET` | `/api/about` | Public | Retrieve public bio, headline, links |
| `PUT` | `/api/admin/about` | Admin | Update portfolio owner bio, headline, links |
| `GET` | `/api/skills` | Public | Retrieve categorized list of technical skills |
| `POST` | `/api/admin/skills` | Admin | Create technical skill competency |
| `PUT` | `/api/admin/skills/{id}` | Admin | Update technical skill |
| `DELETE`| `/api/admin/skills/{id}` | Admin | Delete technical skill |
| `GET` | `/api/projects` | Public | List all published portfolio projects |
| `GET` | `/api/projects/{slug}` | Public | Retrieve single project brief by URL slug |
| `POST` | `/api/admin/projects` | Admin | Create project (Draft/Published) |
| `PUT` | `/api/admin/projects/{id}` | Admin | Update project details, tech stack, links |
| `POST` | `/api/admin/projects/{id}/publish` | Admin | Publish project |
| `DELETE`| `/api/admin/projects/{id}` | Admin | Delete project |
| `GET` | `/api/blogs` | Public | Paginated list of published blog posts (newest first) |
| `GET` | `/api/blogs/{slug}` | Public | Retrieve single blog post by slug |
| `POST` | `/api/admin/blogs` | Admin | Create blog post |
| `POST` | `/api/admin/blogs/{id}/publish` | Admin | Publish blog post |
| `POST` | `/api/admin/media` | Admin | Multipart file upload (JPEG, PNG, WEBP, safe SVG) |
| `GET` | `/api/admin/media` | Admin | List all media asset metadata |
| `POST` | `/api/contact` | Public | Submit visitor contact message |
| `GET` | `/api/admin/messages` | Admin | Retrieve contact message inquiries |
| `PATCH`| `/api/admin/messages/{id}/read`| Admin | Mark inquiry message as read |

---

## 🚢 Production Deployment

### Docker Deployment
The repository includes a production-grade multi-stage [Dockerfile](Dockerfile):
```bash
# Build Docker image
docker build -t portfolio-backend:latest .

# Run container with persistent uploads volume
docker run -d \
  --name portfolio-backend \
  -p 8080:8080 \
  -v media_data:/var/data/uploads \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=jdbc:postgresql://your-db-host:5432/portfolio_db \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=your_db_password \
  -e JWT_SECRET=your_64_byte_random_hex_secret \
  -e CORS_ALLOWED_ORIGINS=https://yourportfolio.com,https://admin.yourportfolio.com \
  portfolio-backend:latest
```

### Deploying on Railway or Render
1. Connect this repository to Railway or Render.
2. Root directory: `/` (or `./portfolio-backend` in monorepo).
3. The platform detects the `Dockerfile` automatically.
4. Mount a persistent disk to `/var/data/uploads`.
5. Supply environment variables according to the table above.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
