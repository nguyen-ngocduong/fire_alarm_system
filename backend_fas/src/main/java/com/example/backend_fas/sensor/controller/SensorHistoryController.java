package com.example.backend_fas.sensor.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_fas.sensor.dto.ChartPoint;
import com.example.backend_fas.sensor.dto.ChartResponse;
import com.example.backend_fas.sensor.dto.SensorData;
import com.example.backend_fas.sensor.service.FirebaseHistoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/history")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "History", description = "API lịch sử dữ liệu cảm biến từ Firebase")
public class SensorHistoryController {
    private final FirebaseHistoryService historyService;

    @GetMapping("/chart")
    @Operation(summary = "Lấy dữ liệu biểu đồ theo giờ gần nhất")
    public CompletableFuture<ResponseEntity<ChartResponse>> getChartData(
        @Parameter(description = "Số giờ gần nhất (1, 6, 12, 24, 48)")
        @RequestParam(defaultValue = "1") int hours
    ){
        return historyService.getRecentHistory(hours)
                .thenApply(records -> {
                    List<ChartPoint> points = records.stream()
                            .map(ChartPoint::fromSensorData)
                            .collect(Collectors.toList());

                    long alertCount = records.stream()
                            .filter(r -> Boolean.TRUE.equals(r.getAlert()))
                            .count();

                    ChartResponse response = ChartResponse.builder()
                            .totalPoints(points.size())
                            .alertCount(alertCount)
                            .rangeLabel("Last " + hours + "h")
                            .data(points)
                            .build();

                    return ResponseEntity.ok(response);
                });
    }

    @GetMapping("/latest")
    @Operation(summary = "Lấy N bản ghi gần nhất")
    public CompletableFuture<ResponseEntity<List<SensorData>>> getLatestRecords(
        @Parameter(description = "Số bản ghi giới hạn")
        @RequestParam(defaultValue = "10") int limit
    ) {
        return historyService.getLatestRecords(limit)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/chart/range")
    @Operation(summary = "Lấy dữ liệu biểu đồ theo khoảng thời gian")
    public CompletableFuture<ResponseEntity<ChartResponse>> getChartDataRange(
            @Parameter(description = "Từ thời điểm (ISO format: yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @Parameter(description = "Đến thời điểm (ISO format: yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return historyService.getHistoryBetween(from, to)
                .thenApply(records -> {
                    List<ChartPoint> points = records.stream()
                            .map(ChartPoint::fromSensorData)
                            .collect(Collectors.toList());

                    long alertCount = records.stream()
                            .filter(r -> Boolean.TRUE.equals(r.getAlert()))
                            .count();

                    ChartResponse response = ChartResponse.builder()
                            .totalPoints(points.size())
                            .alertCount(alertCount)
                            .rangeLabel(from + " → " + to)
                            .data(points)
                            .build();

                    return ResponseEntity.ok(response);
                });
    }
}
