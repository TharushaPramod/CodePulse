package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user")
public class User {
    @Id
    private String name;
    private String email;
    private String password; // Nullable for OAuth users
    private boolean isOAuthUser; // Indicates if user registered via OAuth

    // Getter and Setter for name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter and Setter for email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Getter and Setter for password
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Getter and Setter for isOAuthUser
    public boolean isOAuthUser() {
        return isOAuthUser;
    }

    public void setOAuthUser(boolean isOAuthUser) {
        this.isOAuthUser = isOAuthUser;
    }
}