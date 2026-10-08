package com.portfolio.service.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.contact.notification-email:admin@portfolio.local}")
    private String notificationEmail;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${spring.mail.host:}")
    private String smtpHost;

    @Override
    public void sendContactNotification(String fromName, String fromEmail, String subject, String messageContent) {
        if (mailSender == null || smtpHost == null || smtpHost.isBlank()) {
            log.info("SMTP host not configured. Skipping email dispatch for contact message from '{}' <{}>", fromName, fromEmail);
            return;
        }

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(notificationEmail);
            mailMessage.setSubject("New Portfolio Contact: " + subject);
            mailMessage.setText(String.format("New message received from %s (%s):\n\nSubject: %s\n\n%s",
                    fromName, fromEmail, subject, messageContent));
            if (smtpUsername != null && !smtpUsername.isBlank()) {
                mailMessage.setFrom(smtpUsername);
            }

            mailSender.send(mailMessage);
            log.info("Contact notification email successfully dispatched to '{}' for message from '{}'", notificationEmail, fromEmail);
        } catch (Exception e) {
            log.warn("Failed to send contact notification email for message from '{}' (continuing normally): {}", fromEmail, e.getMessage());
        }
    }
}
