package com.example.demo.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.ProgressUpdate;
import com.example.demo.repository.ProgressUpdateRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository repository;

    public ProgressUpdate createProgressUpdate(ProgressUpdate progressUpdate) {
        progressUpdate.setCreatedAt(LocalDateTime.now());
        progressUpdate.setUpdatedAt(LocalDateTime.now());
        return repository.save(progressUpdate);
    }

    public List<ProgressUpdate> getProgressUpdatesByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<ProgressUpdate> getProgressUpdateById(String id) {
        return repository.findById(id);
    }

    public ProgressUpdate updateProgressUpdate(String id, ProgressUpdate updatedUpdate) {
        Optional<ProgressUpdate> existing = repository.findById(id);
        if (existing.isPresent()) {
            ProgressUpdate progressUpdate = existing.get();
            progressUpdate.setSelectCourse(updatedUpdate.getSelectCourse());
            progressUpdate.setAllLevels(updatedUpdate.getAllLevels());
            progressUpdate.setCompleteLevels(updatedUpdate.getCompleteLevels());
            progressUpdate.setTemplateType(updatedUpdate.getTemplateType());
            progressUpdate.setContent(updatedUpdate.getContent());
            progressUpdate.setUpdatedAt(LocalDateTime.now());
            return repository.save(progressUpdate);
        }
        throw new RuntimeException("Progress update not found");
    }

    public void deleteProgressUpdate(String id) {
        repository.deleteById(id);
    }

    public Object getAllProgressUpdates() {
        return repository.findAll();
    }
}