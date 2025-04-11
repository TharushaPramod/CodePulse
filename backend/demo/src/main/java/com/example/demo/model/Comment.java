package com.example.demo.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "comments") // Collection name in MongoDB
@Data // Lombok: generates getters, setters, etc.
public class Comment {
    @Id
    private String id;
    private String postId; // To associate the comment with a post
    private Long userId; // To associate the comment with a user
    private String content;
    private LocalDateTime createdAt;
}
