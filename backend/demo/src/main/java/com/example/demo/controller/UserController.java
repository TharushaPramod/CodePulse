package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.exception.UserPrincipalNotFoundException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    // Insert
    @PostMapping("/user")
    public ResponseEntity<Map<String, Object>> newUser(@RequestBody User newUser) {
        // Basic validation
        if (newUser.getName() == null || newUser.getEmail() == null || newUser.getPassword() == null ||
            newUser.getName().isEmpty() || newUser.getEmail().isEmpty() || newUser.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Name, email, and password are required"));
        }
        
        User savedUser = userRepository.save(newUser);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("user", savedUser);
        return ResponseEntity.ok(response);
    }

    // User Login
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
        if (user.getPassword() != null && user.getPassword().equals(loginDetails.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("name", user.getName()); // Changed from "id" to "name" for consistency
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }
    }
}