package com.example.backend_fas.security;

import java.net.Authenticator;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.DaoAuthenticationConfigurer;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.backend_fas.User.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final UserRepository userRepository;
    // tai user tu DB
    @Bean
    public UserDetailsService userDetailsService(){
        // sửa lại UserDetailsService trong file ApplicationConfig.java để nó hỗ trợ tìm kiếm theo cả Username (khi đăng nhập) và ID (khi xác thực Token).
        return username -> userRepository.findByUsername(username) 
            .or(() -> {
                try {
                    return userRepository.findById(Long.parseLong(username));
                } catch (NumberFormatException e) {
                    return java.util.Optional.empty();
                }
            })
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
    // xac thuc
    @Bean
    public AuthenticationProvider authenticatorProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());  // cách tải user
        authProvider.setPasswordEncoder(passwordEncoder());        // cách so sánh password
        return authProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
