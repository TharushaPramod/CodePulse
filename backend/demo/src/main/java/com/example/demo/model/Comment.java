package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "comments") // Collection name in MongoDB
@Data // Lombok: generates getters, setters, etc.
public class Comment {
    @Id
    private String id; // MongoDB uses String for IDs by default
    private String content;
    private String author;
}
