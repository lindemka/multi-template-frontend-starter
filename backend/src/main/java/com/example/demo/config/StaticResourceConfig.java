package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve Next.js static files
        registry.addResourceHandler("/nextjs/**")
                .addResourceLocations("classpath:/static/nextjs/");
        
        // Default static resources with custom resolver for directories
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // If resource exists and is readable, return it
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // Try with index.html for directory requests
                        if (!resourcePath.endsWith(".html") && !resourcePath.contains(".")) {
                            String indexPath = resourcePath.endsWith("/") ? 
                                resourcePath + "index.html" : 
                                resourcePath + "/index.html";
                            Resource indexResource = location.createRelative(indexPath);
                            if (indexResource.exists() && indexResource.isReadable()) {
                                return indexResource;
                            }
                        }
                        
                        return null;
                    }
                });
    }
}