package com.example.demo.model;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "comments")
@Data
public class Comment {
    @Id
    private String id;
    private String postId; // To associate the comment with a post
    private String userName; // Store username instead of userId
    private String content;
    private LocalDateTime createdAt;
}