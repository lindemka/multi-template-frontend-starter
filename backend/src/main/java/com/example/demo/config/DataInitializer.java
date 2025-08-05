package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeUsers();
        }
    }

    private void initializeUsers() {
        User user1 = new User("John Doe", "john@example.com", User.Role.ADMIN);
        user1.setAvatar("https://ui-avatars.com/api/?name=John+Doe&background=random");
        user1.setLastLogin(LocalDateTime.now().minusHours(2));

        User user2 = new User("Jane Smith", "jane@example.com", User.Role.EDITOR);
        user2.setAvatar("https://ui-avatars.com/api/?name=Jane+Smith&background=random");
        user2.setLastLogin(LocalDateTime.now().minusHours(5));

        User user3 = new User("Mike Johnson", "mike@example.com", User.Role.VIEWER);
        user3.setAvatar("https://ui-avatars.com/api/?name=Mike+Johnson&background=random");
        user3.setLastLogin(LocalDateTime.now().minusDays(1));

        User user4 = new User("Sarah Wilson", "sarah@example.com", User.Role.MODERATOR);
        user4.setAvatar("https://ui-avatars.com/api/?name=Sarah+Wilson&background=random");
        user4.setLastLogin(LocalDateTime.now().minusHours(1));
        user4.setStatus(User.Status.PENDING);

        User user5 = new User("Alex Chen", "alex@example.com", User.Role.EDITOR);
        user5.setAvatar("https://ui-avatars.com/api/?name=Alex+Chen&background=random");
        user5.setLastLogin(LocalDateTime.now().minusDays(3));
        user5.setStatus(User.Status.INACTIVE);

        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(user4);
        userRepository.save(user5);

        System.out.println("Demo users initialized successfully!");
    }
}