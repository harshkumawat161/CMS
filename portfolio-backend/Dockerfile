# ==============================================================
# Multi-stage Dockerfile for Portfolio CMS Spring Boot Backend
# ==============================================================

# Stage 1: Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper and POM first to leverage Docker layer caching
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy application source code
COPY src ./src

# Build production artifact without test execution
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Minimal runtime stage
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="Alexander Sterling <alex@portfolio.local>"
LABEL description="Production Spring Boot Backend for Developer Portfolio & CMS"

WORKDIR /app

# Create unprivileged application user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create media uploads directory with appropriate permissions
RUN mkdir -p /var/data/uploads && chown -R appuser:appgroup /var/data/uploads

# Copy built JAR from builder stage
COPY --from=builder /build/target/backend-1.0.0.jar app.jar
RUN chown appuser:appgroup app.jar

USER appuser

EXPOSE 8080

# Configure JVM memory ergonomics and production profile
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"
ENV SPRING_PROFILES_ACTIVE="prod"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
