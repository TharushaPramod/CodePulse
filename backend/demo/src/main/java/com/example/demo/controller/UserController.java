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

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
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