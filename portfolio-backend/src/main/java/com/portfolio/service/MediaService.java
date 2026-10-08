package com.portfolio.service;

import com.portfolio.dto.response.MediaResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MediaService {

    MediaResponse uploadMedia(MultipartFile file, String altText);

    List<MediaResponse> getAllMedia();

    MediaResponse getMediaById(Long id);

    void deleteMedia(Long id);
}
