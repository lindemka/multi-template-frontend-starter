package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();
            String authHeader = httpRequest.getHeader("Authorization");
            String token = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
            if (token == null && httpRequest.getCookies() != null) {
                for (Cookie c : httpRequest.getCookies()) {
                    if ("accessToken".equals(c.getName())) {
                        token = c.getValue();
                        break;
                    }
                }
            }
            // If an HTTP-level token is present and valid, attach it.
            if (token != null && jwtUtil.validateToken(token)) {
                attributes.put("jwt", token);
            }
        }
        // Always allow the WebSocket handshake to proceed. Authentication will be enforced
        // at the STOMP CONNECT frame via StompAuthChannelInterceptor using the provided
        // native Authorization header (ws-ticket).
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        // no-op
    }
}


