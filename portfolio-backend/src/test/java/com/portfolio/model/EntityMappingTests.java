package com.portfolio.model;

import com.portfolio.model.enums.ContentStatus;
import com.portfolio.model.enums.Role;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class EntityMappingTests {

    @Autowired
    private EntityManager entityManager;

    @Test
    @DisplayName("Should successfully persist and retrieve User entity")
    void testUserEntity() {
        User user = User.builder()
                .username("john_doe")
                .email("john.doe@portfolio.local")
                .password("$2a$10$hashedpassword")
                .fullName("John Doe")
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();

        entityManager.persist(user);
        entityManager.flush();
        entityManager.clear();

        User found = entityManager.find(User.class, user.getId());
        assertThat(found).isNotNull();
        assertThat(found.getUsername()).isEqualTo("john_doe");
        assertThat(found.getEmail()).isEqualTo("john.doe@portfolio.local");
        assertThat(found.getCreatedAt()).isNotNull();
        assertThat(found.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should successfully persist and retrieve About entity")
    void testAboutEntity() {
        About about = About.builder()
                .name("Alex Morgan")
                .headline("Lead Full-Stack Engineer")
                .bio("10+ years designing distributed systems and reactive web apps.")
                .email("alex@portfolio.local")
                .location("San Francisco, CA")
                .profileImage("/uploads/profile.jpg")
                .resumeUrl("/uploads/resume.pdf")
                .githubUrl("https://github.com/alex")
                .linkedinUrl("https://linkedin.com/in/alex")
                .build();

        entityManager.persist(about);
        entityManager.flush();
        entityManager.clear();

        About found = entityManager.find(About.class, about.getId());
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("Alex Morgan");
        assertThat(found.getBio()).contains("distributed systems");
    }

    @Test
    @DisplayName("Should successfully persist and retrieve Skill entity")
    void testSkillEntity() {
        Skill skill = Skill.builder()
                .name("Java & Spring Boot")
                .category("Backend")
                .proficiency(95)
                .icon("simple-icons:springboot")
                .displayOrder(1)
                .build();

        entityManager.persist(skill);
        entityManager.flush();
        entityManager.clear();

        Skill found = entityManager.find(Skill.class, skill.getId());
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("Java & Spring Boot");
        assertThat(found.getProficiency()).isEqualTo(95);
    }

    @Test
    @DisplayName("Should successfully persist and retrieve Project entity with technologies")
    void testProjectEntity() {
        Project project = Project.builder()
                .title("Cloud Portfolio Platform")
                .slug("cloud-portfolio-platform")
                .shortDescription("Headless portfolio and CMS architecture")
                .description("Detailed description of architecture and technical implementation.")
                .image("/uploads/project1.png")
                .githubUrl("https://github.com/user/portfolio")
                .liveUrl("https://portfolio.demo.com")
                .technologies(List.of("Java", "Spring Boot", "React", "PostgreSQL"))
                .featured(true)
                .displayOrder(1)
                .status(ContentStatus.PUBLISHED)
                .build();

        entityManager.persist(project);
        entityManager.flush();
        entityManager.clear();

        Project found = entityManager.find(Project.class, project.getId());
        assertThat(found).isNotNull();
        assertThat(found.getSlug()).isEqualTo("cloud-portfolio-platform");
        assertThat(found.getStatus()).isEqualTo(ContentStatus.PUBLISHED);
        assertThat(found.getTechnologies()).contains("Java", "Spring Boot", "PostgreSQL");
    }

    @Test
    @DisplayName("Should successfully persist and retrieve Blog entity with tags")
    void testBlogEntity() {
        Blog blog = Blog.builder()
                .title("Mastering Microservices with Spring Boot 3")
                .slug("mastering-microservices-spring-boot-3")
                .excerpt("A guide to high throughput systems.")
                .content("# Microservices Architecture\n\nDeep dive into distributed architectures.")
                .coverImage("/uploads/blog-cover.jpg")
                .publishedAt(Instant.now())
                .status(ContentStatus.PUBLISHED)
                .tags(List.of("Java", "Architecture", "Microservices"))
                .build();

        entityManager.persist(blog);
        entityManager.flush();
        entityManager.clear();

        Blog found = entityManager.find(Blog.class, blog.getId());
        assertThat(found).isNotNull();
        assertThat(found.getTitle()).isEqualTo("Mastering Microservices with Spring Boot 3");
        assertThat(found.getTags()).contains("Architecture");
    }

    @Test
    @DisplayName("Should successfully persist and retrieve Experience entity")
    void testExperienceEntity() {
        Experience experience = Experience.builder()
                .company("Acme Technologies")
                .position("Senior Systems Architect")
                .description("Designed enterprise REST APIs and distributed microservices.")
                .startDate(LocalDate.of(2021, 6, 1))
                .endDate(null)
                .current(true)
                .technologies(List.of("Spring Boot", "Kubernetes", "PostgreSQL"))
                .displayOrder(1)
                .build();

        entityManager.persist(experience);
        entityManager.flush();
        entityManager.clear();

        Experience found = entityManager.find(Experience.class, experience.getId());
        assertThat(found).isNotNull();
        assertThat(found.isCurrent()).isTrue();
        assertThat(found.getEndDate()).isNull();
        assertThat(found.getCompany()).isEqualTo("Acme Technologies");
    }

    @Test
    @DisplayName("Should successfully persist and retrieve Testimonial entity")
    void testTestimonialEntity() {
        Testimonial testimonial = Testimonial.builder()
                .name("Sarah Connor")
                .role("CTO")
                .company("Tech Innovations Inc.")
                .message("Outstanding technical leader who delivered our cloud platform on schedule.")
                .image("/uploads/sarah.jpg")
                .displayOrder(1)
                .published(true)
                .build();

        entityManager.persist(testimonial);
        entityManager.flush();
        entityManager.clear();

        Testimonial found = entityManager.find(Testimonial.class, testimonial.getId());
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("Sarah Connor");
        assertThat(found.isPublished()).isTrue();
    }

    @Test
    @DisplayName("Should successfully persist and retrieve Service entity")
    void testServiceEntity() {
        Service service = Service.builder()
                .title("Full-Stack Cloud Engineering")
                .description("End-to-end cloud applications built with Spring Boot and modern frontend frameworks.")
                .icon("lucide:layers")
                .displayOrder(1)
                .published(true)
                .build();

        entityManager.persist(service);
        entityManager.flush();
        entityManager.clear();

        Service found = entityManager.find(Service.class, service.getId());
        assertThat(found).isNotNull();
        assertThat(found.getTitle()).isEqualTo("Full-Stack Cloud Engineering");
        assertThat(found.isPublished()).isTrue();
    }

    @Test
    @DisplayName("Should successfully persist and retrieve Message entity")
    void testMessageEntity() {
        Message message = Message.builder()
                .name("John Doe")
                .email("john@example.com")
                .subject("Consulting Inquiry")
                .message("Hi, I would love to discuss a potential project collaboration.")
                .read(false)
                .build();

        entityManager.persist(message);
        entityManager.flush();
        entityManager.clear();

        Message found = entityManager.find(Message.class, message.getId());
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("John Doe");
        assertThat(found.isRead()).isFalse();
        assertThat(found.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should successfully persist and retrieve Media entity")
    void testMediaEntity() {
        Media media = Media.builder()
                .filename("1696000000-banner.png")
                .originalFilename("banner.png")
                .contentType("image/png")
                .fileSize(2048576L)
                .storagePath("/uploads/media/1696000000-banner.png")
                .url("/uploads/media/1696000000-banner.png")
                .altText("Hero banner illustration")
                .build();

        entityManager.persist(media);
        entityManager.flush();
        entityManager.clear();

        Media found = entityManager.find(Media.class, media.getId());
        assertThat(found).isNotNull();
        assertThat(found.getFilename()).isEqualTo("1696000000-banner.png");
        assertThat(found.getUploadedAt()).isNotNull();
        assertThat(found.getFileSize()).isEqualTo(2048576L);
    }
}
