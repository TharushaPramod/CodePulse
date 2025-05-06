package com.example.demo.controller;

import com.example.demo.model.Post;
import com.example.demo.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private static final String UPLOAD_DIR = "uploads/"; // Root-level uploads directory

    @Autowired
    private PostRepository postRepository;

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestParam("description") String description,
            @RequestParam(value = "files", required = false) MultipartFile[] files) throws Exception {
        
        // Create upload directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        Post post = new Post();
        post.setUserId(1L); // Dummy user ID (replace with actual authentication)
        post.setDescription(description);
        post.setCreatedAt(LocalDateTime.now());

        List<String> filePaths = new ArrayList<>();
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR + fileName);
                    Files.write(filePath, file.getBytes());
                    filePaths.add("/uploads/" + fileName);
                }
            }
        }
        post.setMediaFiles(filePaths);

        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    // Edit an existing post
    @PutMapping("/{id}")
    public ResponseEntity<Post> editPost(
            @PathVariable String id,
            @RequestParam("description") String description,
            @RequestParam(value = "files", required = false) MultipartFile[] files) throws Exception {

        Post post = postRepository.findById(id).orElse(null);
        if (post == null || !post.getUserId().equals(1L)) {
            return ResponseEntity.notFound().build();
        }

        post.setDescription(description);

        if (files != null && files.length > 0) {
            // Delete old files
            List<String> oldFilePaths = post.getMediaFiles();
            if (oldFilePaths != null) {
                for (String filePath : oldFilePaths) {
                    File file = new File(UPLOAD_DIR + filePath.substring("/uploads/".length()));
                    if (file.exists()) {
                        file.delete();
                    }
                }
            }

            // Save new files
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR + fileName);
                    Files.write(filePath, file.getBytes());
                    filePaths.add("/uploads/" + fileName);
                }
            }
            post.setMediaFiles(filePaths);
        }

        Post updatedPost = postRepository.save(post);
        return ResponseEntity.ok(updatedPost);
    }

    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) throws Exception {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null || !post.getUserId().equals(1L)) {
            return ResponseEntity.notFound().build();
        }

        // Delete associated files
        List<String> filePaths = post.getMediaFiles();
        if (filePaths != null) {
            for (String filePath : filePaths) {
                File file = new File(UPLOAD_DIR + filePath.substring("/uploads/".length()));
                if (file.exists()) {
                    file.delete();
                }
            }
        }

        postRepository.delete(post);
        return ResponseEntity.ok().build();
    }

    // Get all posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postRepository.findAll());
    }
}