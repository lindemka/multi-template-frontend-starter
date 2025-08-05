package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve Next.js static files
        registry.addResourceHandler("/nextjs/**")
                .addResourceLocations("classpath:/static/nextjs/");
        
        // Default static resources
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}