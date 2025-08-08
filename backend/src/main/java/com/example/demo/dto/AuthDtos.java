package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public static class RegisterRequest {
        @NotBlank
        public String username;
        @Email @NotBlank
        public String email;
        @NotBlank @Size(min = 8)
        public String password;
        @NotBlank
        public String firstName;
        @NotBlank
        public String lastName;
    }

    public static class LoginRequest {
        @NotBlank
        public String usernameOrEmail;
        @NotBlank
        public String password;
    }

    public static class TokenResponse {
        public String accessToken;
        public String refreshToken;
        public String tokenType = "Bearer";
    }

    public static class RefreshRequest {
        @NotBlank
        public String refreshToken;
    }

    public static class ForgotPasswordRequest {
        @Email @NotBlank
        public String email;
    }

    public static class ResetPasswordRequest {
        @NotBlank
        public String token;
        @NotBlank @Size(min = 8)
        public String newPassword;
    }

    public static class ChangePasswordRequest {
        @NotBlank
        public String currentPassword;
        @NotBlank @Size(min = 8)
        public String newPassword;
    }

    public static class ChangeEmailRequest {
        @Email @NotBlank
        public String newEmail;
    }

    public static class GoogleLoginRequest {
        @NotBlank
        public String idToken;
    }
}


