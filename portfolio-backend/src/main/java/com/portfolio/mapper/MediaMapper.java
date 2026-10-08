package com.portfolio.mapper;

import com.portfolio.dto.response.MediaResponse;
import com.portfolio.model.Media;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class MediaMapper {

    public MediaResponse toResponse(Media media) {
        if (media == null) {
            return null;
        }

        return MediaResponse.builder()
                .id(media.getId())
                .filename(media.getFilename())
                .originalFilename(media.getOriginalFilename())
                .contentType(media.getContentType())
                .fileSize(media.getFileSize())
                .storagePath(media.getStoragePath())
                .url(media.getUrl())
                .altText(media.getAltText())
                .uploadedAt(media.getUploadedAt())
                .createdAt(media.getCreatedAt())
                .updatedAt(media.getUpdatedAt())
                .build();
    }

    public List<MediaResponse> toResponseList(List<Media> mediaList) {
        if (mediaList == null || mediaList.isEmpty()) {
            return Collections.emptyList();
        }

        return mediaList.stream()
                .map(this::toResponse)
                .toList();
    }
}
