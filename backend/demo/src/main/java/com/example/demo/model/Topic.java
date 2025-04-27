package com.example.demo.model;

import java.util.List;

public class Topic {
    private String title;
    private String details;
    private List<Resource> resources;

    public Topic() {}

    public Topic(String title, String details, List<Resource> resources) {
        this.title = title;
        this.details = details;
        this.resources = resources;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public List<Resource> getResources() { return resources; }
    public void setResources(List<Resource> resources) { this.resources = resources; }

    @Override
    public String toString() {
        return "Topic{" +
                "title='" + title + '\'' +
                ", details='" + details + '\'' +
                ", resources=" + resources +
                '}';
    }
}
