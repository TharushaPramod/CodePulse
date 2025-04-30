package com.example.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.ProgressUpdate;
import com.example.demo.service.ProgressUpdateService;

import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
@CrossOrigin(origins = "http://localhost:3000")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService service;

    @PostMapping
    public ResponseEntity<ProgressUpdate> create(@RequestBody ProgressUpdate progressUpdate) {
        return ResponseEntity.ok(service.createProgressUpdate(progressUpdate));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdate>> getByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(service.getProgressUpdatesByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdate> getById(@PathVariable String id) {
        return service.getProgressUpdateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressUpdate> update(@PathVariable String id, @RequestBody ProgressUpdate progressUpdate) {
        return ResponseEntity.ok(service.updateProgressUpdate(id, progressUpdate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteProgressUpdate(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping
    public ResponseEntity<Object> getAll() {
        return ResponseEntity.ok(service.getAllProgressUpdates());
    }
}