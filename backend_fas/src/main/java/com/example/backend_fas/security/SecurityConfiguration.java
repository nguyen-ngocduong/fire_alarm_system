package com.example.backend_fas.security;

import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Authentication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Tắt CSRF (Cross-Site Request Forgery)
            // REST API dùng token nên không cần CSRF protection
            .csrf(AbstractHttpConfigurer::disable)

            // Cấu hình phân quyền endpoint
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/v1/auth/**",    // đăng ký, đăng nhập → PUBLIC
                    "/api/v1/sensors/**",
                    "/v3/api-docs/**",    // Swagger docs → PUBLIC
                    "/swagger-ui/**",    // Swagger UI → PUBLIC
                    "/swagger-ui.html"
                ).permitAll()            // ← không cần token
                .anyRequest().authenticated()  // ← mọi request khác cần token
            )

            // Không dùng Session (Stateless)
            // Mỗi request phải tự mang token, server không nhớ gì
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Dùng AuthenticationProvider đã cấu hình ở ApplicationConfig
            .authenticationProvider(authenticationProvider)

            // Thêm JwtFilter VÀO TRƯỚC UsernamePasswordAuthenticationFilter
            // Tức là JWT được kiểm tra trước khi Spring Security xử lý
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
