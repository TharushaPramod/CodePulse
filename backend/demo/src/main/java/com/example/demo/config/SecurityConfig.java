package com.example.demo.config;

   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.security.config.annotation.web.builders.HttpSecurity;
   import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
   import org.springframework.security.web.SecurityFilterChain;

   @Configuration
   @EnableWebSecurity
   public class SecurityConfig {

       @Bean
       public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
           http
               .authorizeHttpRequests(authorize -> authorize
                   .requestMatchers("/api/users/**", "/api/posts/**", "/api/comments/**", "/uploads/**", "/api/auth/**").permitAll()
                   .anyRequest().authenticated()
               )
               .oauth2Login(oauth2 -> oauth2
                   .defaultSuccessUrl("/api/users/oauth2/success", true)
                   .failureUrl("/api/users/oauth2/failure")
                   .redirectionEndpoint()
                   .baseUri("/api/auth/google/callback") // Match the registered redirect URI path
               )
               .cors()
               .and()
               .csrf().disable();

           return http.build();
       }
   }