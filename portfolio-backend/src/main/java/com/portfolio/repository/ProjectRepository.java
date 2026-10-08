package com.portfolio.repository;

import com.portfolio.model.Project;
import com.portfolio.model.enums.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByOrderByDisplayOrderAscCreatedAtDesc();

    List<Project> findByStatusOrderByDisplayOrderAscCreatedAtDesc(ContentStatus status);

    List<Project> findByStatusAndFeaturedOrderByDisplayOrderAscCreatedAtDesc(ContentStatus status, boolean featured);

    Optional<Project> findBySlug(String slug);

    Optional<Project> findBySlugAndStatus(String slug, ContentStatus status);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, Long id);
}
