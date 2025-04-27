package com.example.demo.model;

public class Resource {
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

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    @Override
    public String toString() {
        return "Resource{" +
                "title='" + title + '\'' +
                ", type='" + type + '\'' +
                ", content='" + content + '\'' +
                ", filePath='" + filePath + '\'' +
                '}';
    }
}
