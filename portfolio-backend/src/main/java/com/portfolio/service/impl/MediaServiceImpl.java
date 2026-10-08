package com.portfolio.service.impl;

import com.portfolio.dto.response.MediaResponse;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.MediaMapper;
import com.portfolio.model.Media;
import com.portfolio.repository.MediaRepository;
import com.portfolio.service.MediaService;
import com.portfolio.service.storage.MediaStorageService;
import com.portfolio.service.storage.StoredFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

@Service
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final MediaStorageService mediaStorageService;
    private final MediaMapper mediaMapper;

    public MediaServiceImpl(
            MediaRepository mediaRepository,
            MediaStorageService mediaStorageService,
            MediaMapper mediaMapper) {
        this.mediaRepository = mediaRepository;
        this.mediaStorageService = mediaStorageService;
        this.mediaMapper = mediaMapper;
    }

    @Override
    @Transactional
    public MediaResponse uploadMedia(MultipartFile file, String altText) {
        StoredFile storedFile = mediaStorageService.store(file);

        Media media = Media.builder()
                .filename(storedFile.getGeneratedFilename())
                .originalFilename(storedFile.getOriginalFilename())
                .contentType(storedFile.getContentType())
                .fileSize(storedFile.getFileSize())
                .storagePath(storedFile.getStoragePath())
                .url(storedFile.getUrl())
                .altText(altText != null ? altText.trim() : null)
                .uploadedAt(Instant.now())
                .build();

        Media saved = mediaRepository.save(media);
        return mediaMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> getAllMedia() {
        List<Media> mediaList = mediaRepository.findAllByOrderByCreatedAtDesc();
        return mediaMapper.toResponseList(mediaList);
    }

    @Override
    @Transactional(readOnly = true)
    public MediaResponse getMediaById(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media", "id", id));
        return mediaMapper.toResponse(media);
    }

    @Override
    @Transactional
    public void deleteMedia(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media", "id", id));

        // Physically delete from disk / storage
        mediaStorageService.delete(media.getStoragePath());

        // Delete database record
        mediaRepository.delete(media);
    }
}
