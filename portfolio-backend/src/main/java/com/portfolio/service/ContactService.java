package com.portfolio.service;

import com.portfolio.dto.request.ContactMessageRequest;
import com.portfolio.dto.response.MessageResponse;

import java.util.List;

public interface ContactService {

    MessageResponse submitContactMessage(ContactMessageRequest request);

    List<MessageResponse> getAllMessages();

    MessageResponse getMessageById(Long id);

    MessageResponse markMessageAsRead(Long id, Boolean isRead);

    void deleteMessage(Long id);
}
