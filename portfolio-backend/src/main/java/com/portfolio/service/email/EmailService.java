package com.portfolio.service.email;

public interface EmailService {

    void sendContactNotification(String fromName, String fromEmail, String subject, String messageContent);
}
