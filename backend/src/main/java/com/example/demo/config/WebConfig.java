package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirect non-trailing slash URLs to trailing slash for directories
        registry.addRedirectViewController("/dashboard", "/dashboard/");
        registry.addRedirectViewController("/dashboard/profile", "/dashboard/profile/");
        registry.addRedirectViewController("/dashboard/members", "/dashboard/members/");
        registry.addRedirectViewController("/test", "/test/");
    }
}