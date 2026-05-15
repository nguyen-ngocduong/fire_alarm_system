package com.example.backend_fas.sensor.dto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.springframework.cglib.core.Local;

import com.example.backend_fas.sensor.enums.Threshould;
import com.example.backend_fas.sensor.dto.SensorData;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SensorResponse {
    private String device;
    private Boolean alert, flame;
    private Double raw_gas, smoke, temperature, humidity, lpg;
    private Integer ir_flame;  // ← THÊM TRƯỜNG NÀY
    private String status; // FLAME_DETECTED, GAS_LEAK_ALERT, HIGH_TEMP_FIRE
    private LocalDateTime timestamp;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // tra ve trang thai, du lieu lay truc tiep tren firebase
    public static SensorResponse fromSensorData(String device, SensorData data){
        String status = Threshould.NORMAL.toString();
        if(data.hasAlert()){
            status = Threshould.FLAME_DETECTED.toString();
        }
        else if(data.isGasLeak()){
            status = Threshould.GAS_LEAK_ALERT.toString();
        }
        else if(data.isHighTemperature()){
            status = Threshould.HIGH_TEMP_FIRE.toString();
        }

        LocalDateTime dateTime = LocalDateTime.now();
        if (data.getServer_timestamp() != null) {
            try {
                dateTime = LocalDateTime.parse(data.getServer_timestamp(), FORMATTER);
            } catch (Exception e) {
                // Keep current time if parsing fails
            }
        }

        return SensorResponse.builder()
                .device(device)
                .alert(data.getAlert())
                .flame(data.getFlame())
                .raw_gas(data.getRaw_gas())
                .smoke(data.getSmoke())
                .temperature(data.getTemperature())
                .humidity(data.getHumidity())
                .lpg(data.getLpg())
                .ir_flame(data.getIr_flame())  // ← THÊM DÒNG NÀY
                .timestamp(dateTime)
                .status(status)
                .build();
    }
}
