package com.example.backend_fas.User.service;

import java.util.*;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.backend_fas.User.dto.UserDto;
import com.example.backend_fas.User.entity.User;
import com.example.backend_fas.User.enums.Role;
import com.example.backend_fas.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Unauthorized");
        }
        return (User) authentication.getPrincipal();
    }

    public void validateAdmin(User user) {
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can perform this action!");
        }
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        User currentUser = getCurrentUser();
        validateAdmin(currentUser);
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById() {
        User currentUser = getCurrentUser();
        Long id = currentUser.getId();
        return userRepository.findById(id)
                .map(this::mapToDto)
                .orElse(null);
    }

    @Transactional
    public UserDto createUser(UserDto userDto) {
        User currentUser = getCurrentUser();
        validateAdmin(currentUser);
        String password = "password";
        User user = User.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(password))
                .role(userDto.getRole())
                .build();
        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }
    @Transactional
    public UserDto updateUser(UserDto userDto) {
        User currentUser = getCurrentUser();
        Long id = currentUser.getId();
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Validate username change BEFORE modifying the entity
        if (!user.getUsername().equals(userDto.getUsername())) {
            Optional<User> existingUser = userRepository.findByUsername(userDto.getUsername());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new RuntimeException("Username already exists");
            }
        }
        
        // Validate email change BEFORE modifying the entity
        if (!user.getEmail().equals(userDto.getEmail())) {
            Optional<User> existingUser = userRepository.findByEmail(userDto.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new RuntimeException("Email already exists");
            }
        }
        
        // Now it's safe to update the entity
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        
        // Only admin can change role, regular users keep their current role
        if (currentUser.getRole() == Role.ADMIN && userDto.getRole() != null) {
            user.setRole(userDto.getRole());
        }
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Transactional
    public UserDto updateUserById(Long id, UserDto userDto) {
        User currentUser = getCurrentUser();
        validateAdmin(currentUser);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Validate username change BEFORE modifying the entity
        if (!user.getUsername().equals(userDto.getUsername())) {
            Optional<User> existingUser = userRepository.findByUsername(userDto.getUsername());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new RuntimeException("Username already exists");
            }
        }
        
        // Validate email change BEFORE modifying the entity
        if (!user.getEmail().equals(userDto.getEmail())) {
            Optional<User> existingUser = userRepository.findByEmail(userDto.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new RuntimeException("Email already exists");
            }
        }
        
        // Admin can update everything
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        if (userDto.getRole() != null) {
            user.setRole(userDto.getRole());
        }
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User currentUser = getCurrentUser();
        validateAdmin(currentUser);
        userRepository.deleteById(id);
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}