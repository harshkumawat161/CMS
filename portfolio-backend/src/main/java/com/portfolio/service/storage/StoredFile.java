package com.portfolio.service.storage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoredFile {
    private String generatedFilename;
    private String originalFilename;
    private String contentType;
    private long fileSize;
    private String storagePath;
    private String url;
}
