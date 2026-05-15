package com.example.backend_fas.auth.service;

import java.util.HashMap;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend_fas.User.enums.Role;
import com.example.backend_fas.User.repository.UserRepository;
import com.example.backend_fas.auth.dto.AuthRequest;
import com.example.backend_fas.auth.dto.AuthResponse;
import com.example.backend_fas.auth.dto.RefreshTokenRequest;
import com.example.backend_fas.auth.dto.RegisterRequest;
import com.example.backend_fas.security.JwtService;

import lombok.RequiredArgsConstructor;
import com.example.backend_fas.User.entity.*;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // 1. Kiểm tra username đã tồn tại chưa
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("The username already existed");
        }
        
        // Kiểm tra email đã tồn tại chưa
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("The email already existed");
        }

        // 2. Tao user entity tu request
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        // 3. Luu vao db
        repository.save(user);

        // Tao token ngay khi dang ky
        var jwtToken = jwtService.generateToken(new HashMap<>(), user);
        var refreshToken = jwtService.generateRefreshToken(user);

        // Bước 4: Trả về token
        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthResponse signIn(AuthRequest request) {
        // 1. Xac thuc Username + password
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword())
        );

        // Bước 2: Tải user từ DB
        var user = repository.findByUsername(request.getUsername()).orElseThrow();

        // Bước 3: Tạo token
        var jwtToken = jwtService.generateToken(new HashMap<>(), user);
        var refreshToken = jwtService.generateRefreshToken(user);

        // Bước 4: Trả về token
        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    // lam moi access token
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        final String refreshToken = request.getRefreshToken();

        // Bước 1: Đọc userId từ refresh token (Trong JwtService subject là userId)
        final String userIdStr = jwtService.extractUserId(refreshToken);

        if (userIdStr != null) {
            // Bước 2: Tải user từ DB bằng ID
            Long userId = Long.valueOf(userIdStr);
            var user = repository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

            // Bước 3: Kiểm tra refresh token còn hợp lệ không
            if (jwtService.isTokenValid(refreshToken, user)) {

                // Bước 4: Tạo access token MỚI
                var accessToken = jwtService.generateToken(new HashMap<>(), user);

                return AuthResponse.builder()
                        .token(accessToken)
                        .refreshToken(refreshToken) // giữ nguyên refresh token cũ
                        .build();
            }
        }
        return null; // refresh token không hợp lệ
    }
}