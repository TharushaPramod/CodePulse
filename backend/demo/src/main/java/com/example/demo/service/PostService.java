// package com.example.demo.service;

// import com.example.demo.model.Post;
// import com.example.demo.repository.PostRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.Optional;

// @Service
// public class PostService {

//     @Autowired
//     private PostRepository postRepository;

//     public List<Post> getAllPosts() {
//         return postRepository.findAll();
//     }

//     public Post likePost(String postId, String userName) {
//         Optional<Post> postOptional = postRepository.findById(postId);
//         if (!postOptional.isPresent()) {
//             throw new RuntimeException("Post not found");
//         }

//         Post post = postOptional.get();
//         if (post.getLikedBy().contains(userName)) {
//             throw new RuntimeException("User has already liked this post");
//         }

//         post.setLikeCount(post.getLikeCount() + 1);
//         post.getLikedBy().add(userName);
//         return postRepository.save(post);
//     }
// }