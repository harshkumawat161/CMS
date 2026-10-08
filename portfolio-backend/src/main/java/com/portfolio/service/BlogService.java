package com.portfolio.service;

import com.portfolio.dto.request.BlogRequest;
import com.portfolio.dto.response.BlogResponse;
import com.portfolio.dto.response.PagedResponse;

import java.util.List;

public interface BlogService {

    PagedResponse<BlogResponse> getPublicBlogs(int page, int size);

    BlogResponse getPublicBlogBySlug(String slug);

    List<BlogResponse> getAllBlogs();

    BlogResponse getBlogById(Long id);

    BlogResponse createBlog(BlogRequest request);

    BlogResponse updateBlog(Long id, BlogRequest request);

    void deleteBlog(Long id);

    BlogResponse publishBlog(Long id);

    BlogResponse unpublishBlog(Long id);
}
