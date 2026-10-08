package com.portfolio.service.impl;

import com.portfolio.dto.request.BlogRequest;
import com.portfolio.dto.response.BlogResponse;
import com.portfolio.dto.response.PagedResponse;
import com.portfolio.exception.BadRequestException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.BlogMapper;
import com.portfolio.model.Blog;
import com.portfolio.model.enums.ContentStatus;
import com.portfolio.repository.BlogRepository;
import com.portfolio.service.BlogService;
import com.portfolio.util.SlugUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;

    public BlogServiceImpl(BlogRepository blogRepository, BlogMapper blogMapper) {
        this.blogRepository = blogRepository;
        this.blogMapper = blogMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BlogResponse> getPublicBlogs(int page, int size) {
        int pageNumber = Math.max(0, page);
        int pageSize = Math.max(1, Math.min(size, 100));
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<Blog> blogPage = blogRepository.findByStatusOrderByPublishedAtDescCreatedAtDesc(ContentStatus.PUBLISHED, pageable);
        Page<BlogResponse> responsePage = blogPage.map(blogMapper::toResponse);

        return PagedResponse.of(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogResponse getPublicBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlugAndStatus(slug, ContentStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "slug", slug));
        return blogMapper.toResponse(blog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogResponse> getAllBlogs() {
        List<Blog> blogs = blogRepository.findAllByOrderByCreatedAtDesc();
        return blogMapper.toResponseList(blogs);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));
        return blogMapper.toResponse(blog);
    }

    @Override
    @Transactional
    public BlogResponse createBlog(BlogRequest request) {
        String slug = resolveAndValidateSlug(request.getSlug(), request.getTitle());

        if (blogRepository.existsBySlugIgnoreCase(slug)) {
            throw new BadRequestException("A blog with slug '" + slug + "' already exists");
        }

        if (request.getStatus() == ContentStatus.PUBLISHED && request.getPublishedAt() == null) {
            request.setPublishedAt(Instant.now());
        }

        Blog blog = blogMapper.toEntity(request, slug);
        Blog saved = blogRepository.save(blog);
        return blogMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public BlogResponse updateBlog(Long id, BlogRequest request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        String slug = resolveAndValidateSlug(request.getSlug(), request.getTitle());

        if (blogRepository.existsBySlugIgnoreCaseAndIdNot(slug, id)) {
            throw new BadRequestException("Another blog with slug '" + slug + "' already exists");
        }

        if (request.getStatus() == ContentStatus.PUBLISHED && request.getPublishedAt() == null && blog.getPublishedAt() == null) {
            request.setPublishedAt(Instant.now());
        }

        blogMapper.updateEntityFromRequest(blog, request, slug);
        Blog updated = blogRepository.save(blog);
        return blogMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));
        blogRepository.delete(blog);
    }

    @Override
    @Transactional
    public BlogResponse publishBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        blog.setStatus(ContentStatus.PUBLISHED);
        if (blog.getPublishedAt() == null) {
            blog.setPublishedAt(Instant.now());
        }

        Blog saved = blogRepository.save(blog);
        return blogMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public BlogResponse unpublishBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        blog.setStatus(ContentStatus.DRAFT);
        Blog saved = blogRepository.save(blog);
        return blogMapper.toResponse(saved);
    }

    private String resolveAndValidateSlug(String requestedSlug, String title) {
        String rawSlug = (requestedSlug != null && !requestedSlug.isBlank()) ? requestedSlug : title;
        String candidate = SlugUtils.toSlug(rawSlug);
        if (candidate.isBlank() || !SlugUtils.isValidSlug(candidate)) {
            throw new BadRequestException("Could not generate a valid URL slug from the provided title or slug");
        }
        return candidate;
    }
}
