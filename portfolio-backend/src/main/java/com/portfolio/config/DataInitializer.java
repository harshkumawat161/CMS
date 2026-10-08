package com.portfolio.config;

import com.portfolio.model.User;
import com.portfolio.model.enums.Role;
import com.portfolio.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.seed:true}")
    private boolean seedAdmin;

    @Value("${app.admin.default-email:admin@portfolio.local}")
    private String defaultEmail;

    @Value("${app.admin.default-password:Admin@123456}")
    private String defaultPassword;

    @Value("${app.admin.default-username:admin}")
    private String defaultUsername;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!seedAdmin) {
            log.info("Admin seeding is disabled by configuration");
            return;
        }

        if (!userRepository.existsByRole(Role.ROLE_ADMIN)) {
            User admin = User.builder()
                    .username(defaultUsername)
                    .email(defaultEmail)
                    .password(passwordEncoder.encode(defaultPassword))
                    .fullName("Portfolio Administrator")
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(admin);

            log.info("====================================================================");
            log.info("INITIAL ADMIN ACCOUNT SEEDED FOR DEVELOPMENT / INITIAL SETUP:");
            log.info("  Email:    {}", defaultEmail);
            log.info("  Username: {}", defaultUsername);
            log.info("  Password: [Set via ADMIN_PASSWORD environment variable or default]");
            log.info("  NOTICE: In production, configure ADMIN_EMAIL & ADMIN_PASSWORD env vars");
            log.info("====================================================================");
        } else {
            log.info("Administrator account already exists. Skipping admin seed.");
        }
    }
}
