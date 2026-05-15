package com.example.backend_fas.sensor.dto;

import java.util.List;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChartResponse {
    private int totalPoints;        // Tổng số điểm dữ liệu
    private long alertCount;        // Số lần cảnh báo
    private String rangeLabel;      // "Last 1h", "Last 24h", ...
    private List<ChartPoint> data;  // Danh sách điểm dữ liệu
}
