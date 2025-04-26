package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "learningPlans")
public class LearningPlan {
    @Id
    private String id;
    private String title;
    private String description;
    private String timeline;
    private List<Topic> topics;

    public LearningPlan() {}
    public LearningPlan(String title, String description, String timeline, List<Topic> topics) {
        this.title = title;
        this.description = description;
        this.timeline = timeline;
        this.topics = topics;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
    public List<Topic> getTopics() { return topics; }
    public void setTopics(List<Topic> topics) { this.topics = topics; }
}

class Topic {
    private String title;
    private String details;
    private List<Resource> resources;

    public Topic() {}
    public Topic(String title, String details, List<Resource> resources) {
        this.title = title;
        this.details = details;
        this.resources = resources;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public List<Resource> getResources() { return resources; }
    public void setResources(List<Resource> resources) { this.resources = resources; }
}

class Resource {
    private String title;
    private String type;
    private String content;
    private String filePath;

    public Resource() {}
    public Resource(String title, String type, String content, String filePath) {
        this.title = title;
        this.type = type;
        this.content = content;
        this.filePath = filePath;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
}