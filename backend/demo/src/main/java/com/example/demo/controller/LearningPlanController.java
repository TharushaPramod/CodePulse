package com.example.demo.controller;

import com.example.demo.model.LearningPlan;
import com.example.demo.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningPlanController {
    @Autowired
    private LearningPlanService service;

    private final Path rootLocation = Paths.get("uploads");

    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan) {
        return service.save(plan);
    }

    @GetMapping
    public List<LearningPlan> getAllPlans() {
        return service.findAll();
    }

    @PutMapping("/{id}")
    public LearningPlan updatePlan(@PathVariable String id, @RequestBody LearningPlan plan) {
        return service.update(id, plan);
    }

    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable String id) {
        service.delete(id);
    }

    @PostMapping("/upload")
    public String handleFileUpload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }
        Files.createDirectories(rootLocation);
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename(); // Avoid overwrites with timestamp
        Path destinationFile = rootLocation.resolve(fileName).normalize().toAbsolutePath();
        file.transferTo(destinationFile);
        return destinationFile.toString();
    }

    @GetMapping("/uploads/{filename:.+}")
    public Resource serveFile(@PathVariable String filename) throws IOException {
        Path file = rootLocation.resolve(filename).normalize();
        System.out.println("Serving file from: " + file.toString());
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("Could not read file: " + filename);
        }
    }
}