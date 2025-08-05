package com.example.demo.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/nextjs")
public class NextJsController {

    @GetMapping(value = {"", "/", "/dashboard", "/multipurpose"})
    public ResponseEntity<Resource> serveNextJs() throws IOException {
        Resource resource = new ClassPathResource("static/nextjs/index.html");
        if (resource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(resource);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(value = "/dashboard/**")
    public ResponseEntity<Resource> serveDashboard() throws IOException {
        Resource resource = new ClassPathResource("static/nextjs/dashboard/index.html");
        if (resource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(resource);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(value = "/multipurpose/**")
    public ResponseEntity<Resource> serveMultipurpose() throws IOException {
        Resource resource = new ClassPathResource("static/nextjs/multipurpose/index.html");
        if (resource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(resource);
        }
        return ResponseEntity.notFound().build();
    }
}