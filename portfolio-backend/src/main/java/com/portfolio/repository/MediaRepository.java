package com.portfolio.repository;

import com.portfolio.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

    List<Media> findAllByOrderByCreatedAtDesc();

    Optional<Media> findByFilename(String filename);
}
