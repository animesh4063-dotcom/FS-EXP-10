package com.animesh.fs_exp_9;

import com.animesh.fs_exp_9.entity.AppUser;
import com.animesh.fs_exp_9.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class FsExp9Application {

    public static void main(String[] args) {
        SpringApplication.run(FsExp9Application.class, args);
    }

    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.deleteAll(); 
            AppUser admin = new AppUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        };
    }
}