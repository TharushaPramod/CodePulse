package com.example.demo.model;

import java.util.List;

public class Topic {
    private String title;
    private String details;
    private List<LearningResource> resources;

    public Topic() {}

    public Topic(String title, String details, List<LearningResource> resources) {
        this.title = title;
        this.details = details;
        this.resources = resources;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public List<LearningResource> getResources() { return resources; }
    public void setResources(List<LearningResource> resources) { this.resources = resources; }

    @Override
    public String toString() {
        return "Topic{" +
                "title='" + title + '\'' +
                ", details='" + details + '\'' +
                ", resources=" + resources +
                '}';
    }
}
