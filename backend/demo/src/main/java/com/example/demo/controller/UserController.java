package com.example.demo.controller;

import com.example.demo.exception.UserPrincipalNotFoundException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    // Insert new user (manual registration)
    @PostMapping("/user")
    public ResponseEntity<Map<String, Object>> newUser(@RequestBody User newUser) {
        // Basic validation
        if (newUser.getName() == null || newUser.getEmail() == null || newUser.getPassword() == null ||
            newUser.getName().isEmpty() || newUser.getEmail().isEmpty() || newUser.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Name, email, and password are required"));
        }

        // Validate username format
        if (!newUser.getName().matches("^[a-zA-Z0-9_]{3,20}$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username must be 3-20 characters and contain only letters, numbers, or underscores"));
        }

        // Validate email format (basic regex)
        if (!newUser.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid email format"));
        }

        // Check if username already exists
        if (userRepository.findByName(newUser.getName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already exists, please choose another"));
        }

        // Check if email already exists
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already exists, please use another"));
        }

        newUser.setOAuthUser(false);
        User savedUser = userRepository.save(newUser);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("user", savedUser);
        return ResponseEntity.ok(response);
    }

    // User Login (manual login)
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User loginDetails) {
        // Validate input
        if (loginDetails.getEmail() == null || loginDetails.getPassword() == null ||
            loginDetails.getEmail().isEmpty() || loginDetails.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email and password are required"));
        }

        User user = userRepository.findByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new UserPrincipalNotFoundException("Email not found: " + loginDetails.getEmail()));

        // Check if password matches
        if (!user.isOAuthUser() && user.getPassword() != null && user.getPassword().equals(loginDetails.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("name", user.getName());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }
    }

    // OAuth2 Success Handler
    @GetMapping("/oauth2/success")
    public ResponseEntity<Map<String, Object>> oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");

        // Ensure unique username for OAuth2 users
        String uniqueName = name;
        int suffix = 1;
        while (userRepository.findByName(uniqueName).isPresent()) {
            uniqueName = name + suffix++;
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(uniqueName);
            user.setOAuthUser(true);
            user = userRepository.save(user);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "OAuth2 Login successful");
        response.put("name", user.getName());
        return ResponseEntity.ok(response);
    }

    // OAuth2 Failure Handler
    @GetMapping("/oauth2/failure")
    public ResponseEntity<Map<String, Object>> oauth2Failure() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "OAuth2 Login failed"));
    }
}