package com.example.demo.repository;

import com.example.demo.model.User;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Optional: Add custom query methods here if needed
    Optional<User> findByEmail(String email);

}