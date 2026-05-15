package com.example.backend_fas.mail.controller;
import com.example.backend_fas.mail.service.AlertService;
import com.example.backend_fas.mail.service.EmailService;
import com.example.backend_fas.mail.service.FirebaseListenerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
@Tag(name = "Alert", description = "API quản lý cảnh báo")
public class AlertController {

    private final FirebaseListenerService listenerService;
    private final AlertService alertService;
    private final EmailService emailService;

    @PostMapping("/listen/{deviceId}")
    @Operation(summary = "Bắt đầu lắng nghe thiết bị")
    public ResponseEntity<Map<String, String>> startListening(@PathVariable String deviceId) {
        listenerService.startListeningToDevice(deviceId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Started listening to device: " + deviceId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/listen/{deviceId}")
    @Operation(summary = "Dừng lắng nghe thiết bị")
    public ResponseEntity<Map<String, String>> stopListening(@PathVariable String deviceId) {
        listenerService.stopListeningToDevice(deviceId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Stopped listening to device: " + deviceId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active-devices")
    @Operation(summary = "Danh sách thiết bị đang lắng nghe")
    public ResponseEntity<Map<String, Boolean>> getActiveDevices() {
        return ResponseEntity.ok(listenerService.getActiveDevices());
    }

    @PostMapping("/reset-cooldown/{deviceId}")
    @Operation(summary = "Reset cooldown cảnh báo")
    public ResponseEntity<Map<String, String>> resetCooldown(@PathVariable String deviceId) {
        alertService.resetCooldown(deviceId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cooldown reset for device: " + deviceId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test-email")
    @Operation(summary = "Test gửi email")
    public ResponseEntity<Map<String, String>> testEmail(@RequestParam String email) {
        try {
            emailService.testEmail(email);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Test email sent to: " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}