package com.example.demo.model;

public class Resource {
    private String title;
    private String type; // "PDF", "Video", "Link"
    private String content;

    // Constructors
    public Resource() {}
    public Resource(String title, String type, String content) {
        this.title = title;
        this.type = type;
        this.content = content;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
