package com.portfolio.repository;

import com.portfolio.model.Blog;
import com.portfolio.model.enums.ContentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    List<Blog> findAllByOrderByCreatedAtDesc();

    Page<Blog> findByStatusOrderByPublishedAtDescCreatedAtDesc(ContentStatus status, Pageable pageable);

    Optional<Blog> findBySlug(String slug);

    Optional<Blog> findBySlugAndStatus(String slug, ContentStatus status);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, Long id);
}
