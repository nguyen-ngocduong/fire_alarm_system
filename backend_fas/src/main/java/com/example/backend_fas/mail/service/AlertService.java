package com.example.backend_fas.mail.service;

import org.springframework.stereotype.Service;

import com.example.backend_fas.sensor.dto.SensorData;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;

/*
kiểm tra dữ liệu cảm biến và gửi cảnh báo cháy/nổ 
qua email khi phát hiện giá trị vượt ngưỡng.
Service này có nhiệm vụ:
Nhận dữ liệu cảm biến (SensorData)
Kiểm tra:
- có phát hiện lửa không
- nhiệt độ có vượt ngưỡng không
- khói có vượt ngưỡng không
- gas có vượt ngưỡng không
Nếu nguy hiểm:
- gửi email cảnh báo
- lưu thời gian cảnh báo để tránh spam email liên tục
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AlertService {
    private final EmailService emailService;
    @Value("${alert.thresholds.temperature}")
    private Double thresholdTemperature;
    @Value("${alert.thresholds.lpg}")
    private Double thresholdLpg;
    @Value("${alert.thresholds.raw_gas}")
    private Double thresholdRawGas;
    @Value("${alert.thresholds.ir_flame}")
    private Integer thresholdIrFlame;  // ← THÊM DÒNG NÀY
    // luu trang thai canh bao de tranh spam email
    private final Map<String, LocalDateTime> lastAlertTime = new HashMap<>(); // map(divice. time)
    private static final int ALERT_COOLDOWN_MINUTES = 5;
    private boolean isInCoolDown(String device, SensorData data){
        //Kiểm tra xem thiết bị có đang trong thời gian chờ (cooldown) hay không.
        LocalDateTime lastAlert = lastAlertTime.get(device);
        if (lastAlert == null) return false;
        return LocalDateTime.now()
            .isBefore(lastAlert.plusMinutes(ALERT_COOLDOWN_MINUTES));
    }
    public void resetCooldown(String device){
        lastAlertTime.remove(device); // remove canh bao cuoi
        log.info("🔄 Alert cooldown reset for device: {}", device);
    }
    private String getAlertReason(SensorData data){
        if(data.hasAlert()){
            return "Cảm biến phát hiện lửa !";
        }
        if(data.isHighTemperature()){
            return String.format("Nhiệt độ vượt ngưỡng (%.2f°C > %.2f°C)", 
                data.getTemperature(), thresholdTemperature);
        }
        if(data.getLpg() != null && data.getLpg() > thresholdLpg){
            return String.format("Nồng độ LPG vượt ngưỡng (%.2f ppm > %.2f ppm)", 
                data.getLpg(), thresholdLpg);
        }
        if (data.getRaw_gas() != null && data.getRaw_gas() > thresholdRawGas) {
            return String.format("Nồng độ gas vượt ngưỡng (%.2f ppm > %.2f ppm)", 
                data.getRaw_gas(), thresholdRawGas);
        }
        // ← THÊM KIỂM TRA IR_FLAME
        if (data.getIr_flame() != null && data.getIr_flame() > thresholdIrFlame) {
            return String.format("Cảm biến LED hồng ngoại phát hiện lửa (%d > %d)", 
                data.getIr_flame(), thresholdIrFlame);
        }
        return null;
    }
    public void checkAndAlert(String device, SensorData data){
        if(data == null) return;
        // kiem tra xem thiet bi dang trong trang thai cho
        if(isInCoolDown(device, data)){
            log.debug("⏳ Alert cooldown active for device: {}", device);
            return;
        }
        String alertReason = getAlertReason(data);
        //gui email
        if(alertReason != null){
            log.warn("🚨 ALERT TRIGGERED for {}: {}", device, alertReason);
            emailService.sendAlertEmail(device, data, alertReason);
            lastAlertTime.put(device, LocalDateTime.now());
        }
    }
}
