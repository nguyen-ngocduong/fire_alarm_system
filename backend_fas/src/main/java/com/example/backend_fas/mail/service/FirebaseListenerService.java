package com.example.backend_fas.mail.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.backend_fas.sensor.dto.SensorData;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseListenerService {
    private final DatabaseReference databaseReference;
    private final AlertService alertService;

    private final Map<String, ValueEventListener> activeListeners = new HashMap<>();

    @PostConstruct
    public void startListening() {
        // Tự động lắng nghe thiết bị mặc định
        startListeningToDevice("esp32_fire");
    }

    public void startListeningToDevice(String deviceId) {
        if (activeListeners.containsKey(deviceId)) {
            log.warn("⚠️ Already listening to device: {}", deviceId);
            return;
        }

        // Cập nhật đường dẫn: fire_system/current_status theo cấu trúc Firebase của bạn
        DatabaseReference deviceRef = databaseReference.child("fire_system").child("current_status");
        
        ValueEventListener listener = new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                SensorData data = snapshot.getValue(SensorData.class);
                if (data != null) {
                    log.info("📊 Data changed: device={}, temp={}, smoke={}, raw_gas={}, ir_flame={}, alert={}", 
                        data.getDevice(), data.getTemperature(), data.getSmoke(), 
                        data.getRaw_gas(), data.getIr_flame(), data.getAlert());
                    
                    // Kiểm tra xem có đúng deviceId đang lắng nghe không
                    if (deviceId.equals(data.getDevice())) {
                        alertService.checkAndAlert(deviceId, data);
                    }
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                log.error("❌ Firebase listener error for {}: {}", deviceId, error.getMessage());
            }
        };

        deviceRef.addValueEventListener(listener);
        activeListeners.put(deviceId, listener);
        
        log.info("👂 Started listening to device: {} tại đường dẫn: fire_system/current_status", deviceId);
    }

    public void stopListeningToDevice(String deviceId) {
        ValueEventListener listener = activeListeners.remove(deviceId);
        if (listener != null) {
            databaseReference.child("fire_system").child("current_status").removeEventListener(listener);
            log.info("🛑 Stopped listening to device: {}", deviceId);
        }
    }

    public Map<String, Boolean> getActiveDevices() {
        Map<String, Boolean> devices = new HashMap<>();
        activeListeners.keySet().forEach(deviceId -> devices.put(deviceId, true));
        return devices;
    }
}
