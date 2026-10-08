package com.portfolio.controller;

import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.BlogResponse;
import com.portfolio.dto.response.PagedResponse;
import com.portfolio.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blogs")
@Tag(name = "Blogs", description = "Public endpoints for articles and blog posts")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    @Operation(summary = "Get published blogs", description = "Returns paginated published blogs ordered newest first")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Paginated blogs retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PagedResponse<BlogResponse>>> getPublicBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<BlogResponse> blogs = blogService.getPublicBlogs(page, size);
        return ResponseEntity.ok(ApiResponse.success("Blogs retrieved successfully", blogs));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get published blog by slug", description = "Returns a single published blog post by its slug")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Blog post retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Blog post not found or not published")
    })
    public ResponseEntity<ApiResponse<BlogResponse>> getPublicBlogBySlug(@PathVariable String slug) {
        BlogResponse blog = blogService.getPublicBlogBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Blog retrieved successfully", blog));
    }
}
