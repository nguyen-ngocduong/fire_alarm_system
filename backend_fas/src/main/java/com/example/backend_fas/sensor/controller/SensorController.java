package com.example.backend_fas.sensor.controller;

import com.example.backend_fas.sensor.dto.SensorData;
import com.example.backend_fas.sensor.dto.SensorResponse;
import com.example.backend_fas.sensor.service.SensorDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/sensors")
@RequiredArgsConstructor
@Tag(name = "Sensor", description = "API quản lý dữ liệu cảm biến")
public class SensorController {

    private final SensorDataService firebaseService;

    @GetMapping("/test-connection")
    @Operation(summary = "Kiểm tra kết nối Firebase")
    public CompletableFuture<ResponseEntity<Map<String, Object>>> testConnection() {
        return firebaseService.testConnection()
                .thenApply(connected -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("connected", connected);
                    response.put("message", connected ? "Firebase connected successfully" : "Firebase connection failed");
                    return ResponseEntity.ok(response);
                });
    }

    @GetMapping("/{deviceId}")
    @Operation(summary = "Lấy dữ liệu cảm biến theo deviceId")
    public CompletableFuture<ResponseEntity<SensorResponse>> getSensorData(
            @PathVariable String deviceId) {
        return firebaseService.getSensorData(deviceId)
                .thenApply(data -> {
                    if (data == null) {
                        return ResponseEntity.notFound().build();
                    }
                    SensorResponse response = SensorResponse.fromSensorData(deviceId, data);
                    return ResponseEntity.ok(response);
                });
    }
}