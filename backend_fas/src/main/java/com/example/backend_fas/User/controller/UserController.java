package com.example.backend_fas.User.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_fas.User.dto.UserDto;
import com.example.backend_fas.User.entity.User;
import com.example.backend_fas.User.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.parameters.RequestBody; Đây là annotation của Swagger chỉ dùng để làm tài liệu
import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for managing user accounts")

public class UserController {
    private final UserService service;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create_user")
    @Operation(summary = "Create user", description = "Create a user account (Admin only)")
    public ResponseEntity<UserDto> createUser(
        @Valid @RequestBody  UserDto userDto
    )
    {
        return ResponseEntity.ok(service.createUser(userDto));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/get/allUser")
    @Operation(summary = "Get all user", description = "Get all user account (Admin only)")
    public ResponseEntity<List<UserDto>> getAllUsers(){
        return ResponseEntity.ok(service.getAllUsers());
    }
    @GetMapping("/get/user/{id}")
    @Operation(summary = "Get user by id")
    public ResponseEntity<UserDto> getUserById(){
        return ResponseEntity.ok(service.getUserById());
    }
    @PutMapping("/update/profile")
    @Operation(summary = "Update current user profile", description = "Update username, email, and other info for the currently authenticated user")
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UserDto userDto) {
        UserDto updatedUser = service.updateUser(userDto);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.badRequest().build();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/user/{id}")
    @Operation(summary = "Update any user (Admin only)", description = "Admin can update any user's information by their ID")
    public ResponseEntity<UserDto> updateUserById(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
        UserDto updatedUser = service.updateUserById(id, userDto);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.badRequest().build();
    }
    @DeleteMapping("/delete/user/{id}")
    @Operation(summary = "Delete user", description = "Delete a user account by their ID (Admin only)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
