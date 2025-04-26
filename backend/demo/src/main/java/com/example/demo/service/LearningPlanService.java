package com.example.demo.service;

import com.example.demo.model.LearningPlan;
import com.example.demo.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningPlanService {
    @Autowired
    private LearningPlanRepository repository;

    public LearningPlan save(LearningPlan plan) {
        return repository.save(plan);
    }

    public List<LearningPlan> findAll() {
        return repository.findAll();
    }

    public LearningPlan update(String id, LearningPlan plan) {
        plan.setId(id);
        return repository.save(plan);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Learning Plan not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}