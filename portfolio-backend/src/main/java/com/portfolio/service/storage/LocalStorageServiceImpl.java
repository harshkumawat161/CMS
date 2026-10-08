package com.portfolio.service.storage;

import com.portfolio.exception.BadRequestException;
import com.portfolio.exception.StorageException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class LocalStorageServiceImpl implements MediaStorageService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024L; // 10MB limit

    private static final Map<String, Set<String>> ALLOWED_EXTENSIONS_AND_MIMES = Map.of(
            "jpg", Set.of("image/jpeg"),
            "jpeg", Set.of("image/jpeg"),
            "png", Set.of("image/png"),
            "webp", Set.of("image/webp"),
            "svg", Set.of("image/svg+xml", "image/svg", "text/xml", "application/xml")
    );

    @Value("${app.storage.local-path:./uploads}")
    private String basePath;

    private Path mediaStorageDir;

    @PostConstruct
    public void init() {
        try {
            this.mediaStorageDir = Paths.get(basePath, "media").toAbsolutePath().normalize();
            Files.createDirectories(this.mediaStorageDir);
        } catch (IOException e) {
            throw new StorageException("Could not initialize local media storage directory: " + e.getMessage());
        }
    }

    @Override
    public StoredFile store(MultipartFile file) {
        validateFile(file);

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename().trim() : "unnamed";
        String extension = extractExtension(originalFilename);
        String generatedFilename = UUID.randomUUID() + "-" + System.currentTimeMillis() + "." + extension;

        try {
            Path destinationFile = this.mediaStorageDir.resolve(generatedFilename).normalize();

            // Guard against path traversal
            if (!destinationFile.startsWith(this.mediaStorageDir)) {
                throw new BadRequestException("Path traversal attempt detected in filename");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            String publicUrl = "/uploads/media/" + generatedFilename;
            String relativeStoragePath = "media/" + generatedFilename;

            return StoredFile.builder()
                    .generatedFilename(generatedFilename)
                    .originalFilename(originalFilename)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .storagePath(relativeStoragePath)
                    .url(publicUrl)
                    .build();

        } catch (IOException e) {
            throw new StorageException("Failed to store uploaded file: " + e.getMessage());
        }
    }

    @Override
    public void delete(String storagePath) {
        if (storagePath == null || storagePath.isBlank()) {
            return;
        }

        try {
            Path resolvedPath = Paths.get(basePath).toAbsolutePath().resolve(storagePath).normalize();
            Path rootUploadPath = Paths.get(basePath).toAbsolutePath().normalize();

            // Path traversal guard
            if (!resolvedPath.startsWith(rootUploadPath)) {
                throw new BadRequestException("Path traversal attempt in storage deletion path");
            }

            Files.deleteIfExists(resolvedPath);
        } catch (IOException e) {
            throw new StorageException("Failed to delete stored file: " + e.getMessage());
        }
    }

    @Override
    public boolean exists(String storagePath) {
        if (storagePath == null || storagePath.isBlank()) {
            return false;
        }
        Path resolvedPath = Paths.get(basePath).toAbsolutePath().resolve(storagePath).normalize();
        return Files.exists(resolvedPath);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum allowed limit of 10MB");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new BadRequestException("Original filename cannot be empty");
        }

        String extension = extractExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS_AND_MIMES.containsKey(extension)) {
            throw new BadRequestException("Unsupported file extension: ." + extension + ". Allowed formats: JPEG, PNG, WEBP, SVG");
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            throw new BadRequestException("Content-Type header is required");
        }

        String normalizedContentType = contentType.toLowerCase(Locale.ENGLISH).trim();
        Set<String> validMimes = ALLOWED_EXTENSIONS_AND_MIMES.get(extension);
        if (!validMimes.contains(normalizedContentType)) {
            throw new BadRequestException("MIME type '" + contentType + "' does not match file extension '." + extension + "'");
        }

        // SVG security inspection: block script tags, dangerous XML elements, and event handlers
        if ("svg".equalsIgnoreCase(extension)) {
            try {
                String svgContent = new String(file.getBytes(), StandardCharsets.UTF_8).toLowerCase(Locale.ENGLISH);
                if (svgContent.contains("<script") ||
                        svgContent.contains("javascript:") ||
                        svgContent.contains("<foreignobject") ||
                        svgContent.contains("<iframe") ||
                        svgContent.contains("<embed") ||
                        svgContent.contains("<object") ||
                        java.util.regex.Pattern.compile("on\\w+\\s*=").matcher(svgContent).find() ||
                        java.util.regex.Pattern.compile("(href|xlink:href)\\s*=\\s*['\"]\\s*javascript:").matcher(svgContent).find()) {
                    throw new BadRequestException("SVG file rejected: potentially malicious script detected");
                }
            } catch (IOException e) {
                throw new BadRequestException("Could not read SVG file content for safety inspection");
            }
        }
    }

    private String extractExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            throw new BadRequestException("Uploaded file must have a valid extension");
        }
        return filename.substring(lastDotIndex + 1).toLowerCase(Locale.ENGLISH).trim();
    }
}
