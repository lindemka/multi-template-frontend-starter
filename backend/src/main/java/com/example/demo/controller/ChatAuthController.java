package com.example.demo.controller;

import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatAuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/ws-ticket")
    public ResponseEntity<Map<String, String>> issueWsTicket(@AuthenticationPrincipal User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("ws", true);
        String token = jwtUtil.generateToken(user.getUsername(), claims);
        Map<String, String> resp = new HashMap<>();
        resp.put("token", token);
        return ResponseEntity.ok(resp);
    }
}


