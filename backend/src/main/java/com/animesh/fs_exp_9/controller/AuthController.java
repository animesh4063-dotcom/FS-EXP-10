package com.animesh.fs_exp_9.controller;

import com.animesh.fs_exp_9.security.JwtUtil;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // --- EXPERIMENT 7: LOGIN & RBAC ---
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> credentials) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(credentials.get("username"), credentials.get("password"))
        );
        return jwtUtil.generateToken(credentials.get("username"));
    }

    @GetMapping("/user-data")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public String getProtectedData() {
        return "SUCCESS: You have accessed a protected route with a valid JWT!";
    }

    @GetMapping("/admin-data")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String getAdminData() {
        return "SUCCESS: You have ADMIN privileges! This secret data came from Spring Boot.";
    }

    // --- EXPERIMENT 8: PUBLIC API FOR REACT TABLE ---
    @GetMapping("/public/products")
    public java.util.List<Map<String, String>> getPublicProducts() {
        return java.util.List.of(
            Map.of("id", "1", "name", "Gaming Laptop", "price", "$1200"),
            Map.of("id", "2", "name", "Wireless Mouse", "price", "$25"),
            Map.of("id", "3", "name", "Mechanical Keyboard", "price", "$75")
        );
    }
}