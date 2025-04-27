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

    // Getters and Setters
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

    @Override
    public String toString() {
        return "LearningPlan{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", timeline='" + timeline + '\'' +
                ", topics=" + topics +
                '}';
    }
}
