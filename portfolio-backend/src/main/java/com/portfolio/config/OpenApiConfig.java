package com.portfolio.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    public static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI portfolioOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Portfolio CMS Platform REST API")
                        .version("1.0.0")
                        .description("Production-grade backend REST API powering the custom CMS Admin Dashboard and Public Portfolio Web App.")
                        .contact(new Contact()
                                .name("Portfolio Admin")
                                .email("admin@portfolio.local"))
                        .license(new License().name("MIT License")))
                .tags(List.of(
                        new Tag().name("Authentication").description("Admin authentication, JWT token refresh, and user session management"),
                        new Tag().name("About").description("Portfolio owner profile, bio, resume, and social links"),
                        new Tag().name("Skills").description("Technical proficiencies and categorized skill management"),
                        new Tag().name("Projects").description("Showcase portfolio projects, tech stacks, and live demo links"),
                        new Tag().name("Blogs").description("Articles and publications with draft/published lifecycle"),
                        new Tag().name("Experience").description("Career journey, employment positions, and achievements"),
                        new Tag().name("Testimonials").description("Client and colleague recommendations and reviews"),
                        new Tag().name("Services").description("Professional offerings, specialties, and architectural consulting"),
                        new Tag().name("Media").description("File upload, image management, and asset serving"),
                        new Tag().name("Contact").description("Public contact form submission"),
                        new Tag().name("Messages").description("Admin inbox and contact inquiry management"),
                        new Tag().name("System").description("Health check and system diagnostics")
                ))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT Bearer token obtained from POST /api/auth/login. Example: 'eyJhbGciOiJIUzI1NiIsIn...'")));
    }
}

