package com.example.backend_fas.sensor.dto;

import lombok.Builder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChartPoint {
    private String time;        // "14:30:00" - nhãn trục X
    private Double temperature;
    private Double humidity;
    private Double lpg;
    private Double raw_gas;
    private Double smoke;
    private Integer ir_flame;   // ← Giá trị LED hồng ngoại
    private Boolean alert;
    private Boolean flame;
    private String status;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static ChartPoint fromSensorData(SensorData data) {
        String timeLabel = "Unknown";
        if (data.getServer_timestamp() != null) {
            try {
                LocalDateTime dateTime = LocalDateTime.parse(data.getServer_timestamp(), DATETIME_FMT);
                timeLabel = dateTime.format(TIME_FMT);
            } catch (Exception e) {
                timeLabel = LocalDateTime.now().format(TIME_FMT);
            }
        }

        String status = "NORMAL";
        if (data.hasAlert()) {
            status = "FLAME_DETECTED";
        } else if (data.isGasLeak()) {
            status = "GAS_LEAK_ALERT";
        } else if (data.isHighTemperature()) {
            status = "HIGH_TEMP_FIRE";
        }

        return ChartPoint.builder()
                .time(timeLabel)
                .temperature(data.getTemperature())
                .humidity(data.getHumidity())
                .lpg(data.getLpg())
                .raw_gas(data.getRaw_gas())
                .smoke(data.getSmoke())
                .ir_flame(data.getIr_flame())  // ← THÊM
                .alert(data.getAlert())
                .flame(data.getFlame())
                .status(status)
                .build();
    }
}
