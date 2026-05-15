package com.example.backend_fas.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import lombok.RequiredArgsConstructor;
import java.io.IOException;
/*
**Nhiệm vụ:** Chặn **mọi HTTP request**, đọc token trong header, 
xác minh và set thông tin user vào context.

 */
@Component
@RequiredArgsConstructor

public class JwtAuthenticationFilter extends OncePerRequestFilter{
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Bước 1: Đọc header
        final String authHeader = request.getHeader("Authorization");

        // Bước 1b: Không có token → bỏ qua
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;  // ← dừng filter này, không xử lý tiếp
        }

        // Bước 2: Tách token (bỏ "Bearer ")
        final String jwt = authHeader.substring(7);

        // Bước 3: Đọc userId từ token
        final String username = jwtService.extractUserId(jwt);

        // Bước 4+5+6+7: Xác thực nếu chưa có trong context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Tạo authentication object
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,              // principal (thông tin user)
                        null,                     // credentials (không cần password nữa)
                        userDetails.getAuthorities() // quyền: [ROLE_USER] hoặc [ROLE_ADMIN]
                    );
                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Lưu vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Cho request đi tiếp
        filterChain.doFilter(request, response);
    }
}