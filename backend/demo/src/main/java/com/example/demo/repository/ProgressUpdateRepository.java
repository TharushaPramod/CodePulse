package com.example.demo.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.ProgressUpdate;

import java.util.List;

public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
    List<ProgressUpdate> findByUserId(String userId);
}