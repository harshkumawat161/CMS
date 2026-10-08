package com.portfolio.mapper;

import com.portfolio.dto.request.BlogRequest;
import com.portfolio.dto.response.BlogResponse;
import com.portfolio.model.Blog;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BlogMapper {

    public BlogResponse toResponse(Blog blog) {
        if (blog == null) {
            return null;
        }

        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .slug(blog.getSlug())
                .excerpt(blog.getExcerpt())
                .content(blog.getContent())
                .coverImage(blog.getCoverImage())
                .publishedAt(blog.getPublishedAt())
                .status(blog.getStatus())
                .tags(blog.getTags() != null ? new ArrayList<>(blog.getTags()) : Collections.emptyList())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .build();
    }

    public List<BlogResponse> toResponseList(List<Blog> blogs) {
        if (blogs == null || blogs.isEmpty()) {
            return Collections.emptyList();
        }

        return blogs.stream()
                .map(this::toResponse)
                .toList();
    }

    public Blog toEntity(BlogRequest request, String finalSlug) {
        if (request == null) {
            return null;
        }

        return Blog.builder()
                .title(request.getTitle().trim())
                .slug(finalSlug)
                .excerpt(request.getExcerpt() != null ? request.getExcerpt().trim() : null)
                .content(request.getContent().trim())
                .coverImage(request.getCoverImage() != null ? request.getCoverImage().trim() : null)
                .publishedAt(request.getPublishedAt())
                .status(request.getStatus() != null ? request.getStatus() : com.portfolio.model.enums.ContentStatus.DRAFT)
                .tags(request.getTags() != null ? sanitizeTags(request.getTags()) : new ArrayList<>())
                .build();
    }

    public void updateEntityFromRequest(Blog blog, BlogRequest request, String finalSlug) {
        if (blog == null || request == null) {
            return;
        }

        blog.setTitle(request.getTitle().trim());
        blog.setSlug(finalSlug);
        blog.setExcerpt(request.getExcerpt() != null ? request.getExcerpt().trim() : null);
        blog.setContent(request.getContent().trim());
        blog.setCoverImage(request.getCoverImage() != null ? request.getCoverImage().trim() : null);
        if (request.getPublishedAt() != null) {
            blog.setPublishedAt(request.getPublishedAt());
        }
        if (request.getStatus() != null) {
            blog.setStatus(request.getStatus());
        }
        if (request.getTags() != null) {
            if (blog.getTags() == null) {
                blog.setTags(new ArrayList<>());
            } else {
                blog.getTags().clear();
            }
            blog.getTags().addAll(sanitizeTags(request.getTags()));
        }
    }

    private List<String> sanitizeTags(List<String> raw) {
        return raw.stream()
                .filter(t -> t != null && !t.isBlank())
                .map(String::trim)
                .distinct()
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
