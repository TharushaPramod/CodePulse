package com.example.demo.controller;

import com.example.demo.model.Post;
import com.example.demo.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class PostController {

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    @Autowired
    private PostRepository postRepository;

    // Create a new post
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam("description") String description,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam("userName") String userName) throws Exception {
        
        System.out.println("Creating post: description=" + description + ", userName=" + userName + ", files=" + (files != null ? files.length : 0));

        // Create upload directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        Post post = new Post();
        post.setUserName(userName);
        post.setDescription(description);
        post.setCreatedAt(LocalDateTime.now());

        List<String> filePaths = new ArrayList<>();
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR, fileName);
                    Files.write(filePath, file.getBytes());
                    filePaths.add("/uploads/" + fileName);
                    System.out.println("Saved file to: " + filePath.toString());
                }
            }
        }
        post.setMediaFiles(filePaths);

        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    // Edit an existing post
    @PutMapping("/{id}")
    public ResponseEntity<?> editPost(
            @PathVariable String id,
            @RequestParam("description") String description,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam("userName") String userName) throws Exception {

        Post post = postRepository.findById(id).orElse(null);
        if (post == null || !post.getUserName().equals(userName)) {
            return ResponseEntity.status(404).body("Post not found or you are not authorized to edit this post");
        }

        post.setDescription(description);

        if (files != null && files.length > 0) {
            // Delete old files if they exist
            List<String> oldFilePaths = post.getMediaFiles();
            if (oldFilePaths != null) {
                for (String filePath : oldFilePaths) {
                    try {
                        File file = new File(UPLOAD_DIR + filePath.substring("/uploads/".length()));
                        if (file.exists()) {
                            if (!file.delete()) {
                                System.err.println("Failed to delete old file: " + file.getAbsolutePath());
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Error deleting old file: " + filePath + " - " + e.getMessage());
                    }
                }
            }

            // Upload new files
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR, fileName);
                    Files.write(filePath, file.getBytes());
                    filePaths.add("/uploads/" + fileName);
                    System.out.println("Saved file to: " + filePath.toString());
                }
            }
            post.setMediaFiles(filePaths);
        }

        Post updatedPost = postRepository.save(post);
        return ResponseEntity.ok(updatedPost);
    }

    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id, @RequestParam("userName") String userName) {
        try {
            Post post = postRepository.findById(id).orElse(null);
            if (post == null || !post.getUserName().equals(userName)) {
                return ResponseEntity.status(404).body("Post not found or you are not authorized to delete this post");
            }

            // Delete associated files
            List<String> filePaths = post.getMediaFiles();
            if (filePaths != null) {
                for (String filePath : filePaths) {
                    try {
                        File file = new File(UPLOAD_DIR + filePath.substring("/uploads/".length()));
                        if (file.exists()) {
                            if (!file.delete()) {
                                System.err.println("Failed to delete file: " + file.getAbsolutePath());
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Error deleting file: " + filePath + " - " + e.getMessage());
                    }
                }
            }

            postRepository.delete(post);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting post with ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to delete post: " + e.getMessage());
        }
    }

    // Get all posts, sorted by createdAt in descending order
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    // Like a post
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable String id, @RequestBody String userName) {
        try {
            Post post = postRepository.findById(id).orElse(null);
            if (post == null) {
                return ResponseEntity.status(404).body("Post not found");
            }

            userName = userName.replace("\"", "");
            if (post.getLikedBy().contains(userName)) {
                return ResponseEntity.status(400).body("User has already liked this post");
            }

            post.getLikedBy().add(userName);
            post.setLikeCount(post.getLikeCount() + 1);

            Post updatedPost = postRepository.save(post);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            System.err.println("Error liking post with ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to like post: " + e.getMessage());
        }
    }
}