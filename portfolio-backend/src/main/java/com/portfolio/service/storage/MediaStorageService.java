package com.portfolio.service.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Storage abstraction allowing local filesystem or cloud object storage (e.g. AWS S3) implementations.
 */
public interface MediaStorageService {

    StoredFile store(MultipartFile file);

    void delete(String storagePath);

    boolean exists(String storagePath);
}
