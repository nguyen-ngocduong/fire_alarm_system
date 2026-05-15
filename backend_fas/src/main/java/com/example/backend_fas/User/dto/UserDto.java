package com.example.backend_fas.User.dto;

import java.time.LocalDateTime;

import com.example.backend_fas.User.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserDto {
    private Long id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotNull(message = "Role is required")
    private Role role;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}