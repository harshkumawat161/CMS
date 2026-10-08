package com.portfolio.service.impl;

import com.portfolio.dto.request.ContactMessageRequest;
import com.portfolio.dto.response.MessageResponse;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.MessageMapper;
import com.portfolio.model.Message;
import com.portfolio.repository.MessageRepository;
import com.portfolio.service.ContactService;
import com.portfolio.service.email.EmailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final EmailService emailService;

    public ContactServiceImpl(
            MessageRepository messageRepository,
            MessageMapper messageMapper,
            EmailService emailService) {
        this.messageRepository = messageRepository;
        this.messageMapper = messageMapper;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public MessageResponse submitContactMessage(ContactMessageRequest request) {
        Message message = messageMapper.toEntity(request);
        Message saved = messageRepository.save(message);

        // Attempt asynchronous/fault-tolerant email dispatch
        emailService.sendContactNotification(
                saved.getName(),
                saved.getEmail(),
                saved.getSubject(),
                saved.getMessage()
        );

        return messageMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getAllMessages() {
        List<Message> messages = messageRepository.findAllByOrderByCreatedAtDesc();
        return messageMapper.toResponseList(messages);
    }

    @Override
    @Transactional(readOnly = true)
    public MessageResponse getMessageById(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", id));
        return messageMapper.toResponse(message);
    }

    @Override
    @Transactional
    public MessageResponse markMessageAsRead(Long id, Boolean isRead) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", id));

        message.setRead(isRead != null ? isRead : true);
        Message updated = messageRepository.save(message);
        return messageMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message", "id", id));
        messageRepository.delete(message);
    }
}
