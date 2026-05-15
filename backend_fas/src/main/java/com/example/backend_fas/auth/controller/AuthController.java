package com.example.backend_fas.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_fas.auth.dto.AuthRequest;
import com.example.backend_fas.auth.dto.AuthResponse;
import com.example.backend_fas.auth.dto.RefreshTokenRequest;
import com.example.backend_fas.auth.dto.RegisterRequest;
import com.example.backend_fas.auth.service.AuthService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth") // base URL
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration and login")
public class AuthController {
    private final AuthService service;    

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
        @Valid @RequestBody RegisterRequest request
    ){
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(
        @Valid @RequestBody AuthRequest request
    ){
        return ResponseEntity.ok(service.signIn(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(
        @Valid @RequestBody RefreshTokenRequest request
    ){
        return ResponseEntity.ok(service.refreshToken(request));
    }
}
