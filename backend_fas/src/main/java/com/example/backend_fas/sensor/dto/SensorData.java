package com.example.backend_fas.sensor.dto;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.backend_fas.sensor.enums.Threshould;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SensorData {
    private Boolean alert;
    private Boolean flame; // cam bien Flame sensor
    private Double raw_gas;
    private Double smoke;
    private Double temperature;
    private String server_timestamp;
    private Integer ir_flame;
    private Double humidity;
    private Double lpg;
    private String device;
    // Ngưỡng cảnh báo
    private static final double TEMP_THRESHOLD = 45.0;
    private static final double LPG_THRESHOLD = 1000.0;
    private static final double RAW_GAS_THRESHOLD = 1500.0;
    private static final int IR_FLAME_THRESHOLD = 3500;
    
    //ktra canh bao
    public boolean hasAlert(){
        if(alert == true || flame == true || isIrFlameDetected()){
            return true;
        }
        return false;
    }
    
    public boolean isHighTemperature(){
        return (temperature != null && temperature > TEMP_THRESHOLD);
    }
    
    public boolean isGasLeak(){
        return (lpg != null && lpg > LPG_THRESHOLD) || (raw_gas != null && raw_gas > RAW_GAS_THRESHOLD);
    }
    
    public boolean isIrFlameDetected(){
        return (ir_flame != null && ir_flame > IR_FLAME_THRESHOLD);
    }
}