package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

import java.time.LocalDateTime;

@Data
@Document(collection = "progress_updates")
public class ProgressUpdate {
    @Id
    private String id;
    private String userId; // Reference to the user who posted
    private String selectCourse;
    private String allLevels;
    private String completeLevels;
    private String templateType; // e.g., "completed_tutorial", "new_skill", "ongoing_project"
    private String content; // Description of the progress
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
