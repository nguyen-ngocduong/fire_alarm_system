package com.example.backend_fas.sensor.service;
import java.util.concurrent.CompletableFuture;

//doc du lieu tu Firebase
import org.springframework.stereotype.Service;

import com.example.backend_fas.sensor.dto.SensorData;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.database.core.ValueEventRegistration;

import io.netty.util.concurrent.CompleteFuture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j //@Slf4j là annotation của thư viện Project Lombok dùng để tự động tạo logger cho class.
@Service
@RequiredArgsConstructor
public class SensorDataService {
    /* Doc du lieu tu cam bien
    @Param device ten thiet bi de doc cam bien
    @rReturn tra ve SensorData hoac Null
     */
    private final DatabaseReference databaseReference;
    public CompletableFuture<SensorData> getSensorData(String device){
        /*
        đọc dữ liệu cảm biến từ Firebase Realtime Database theo device
        và trả kết quả bất đồng bộ bằng CompletableFuture<SensorData>.
        ko thuc hien tuan tu
         */
        CompletableFuture<SensorData> future = new CompletableFuture<>();
        DatabaseReference databaseRef = databaseReference.child("fire_system").child("current_status");
        // gui request len firebase
        databaseRef.addListenerForSingleValueEvent(new ValueEventListener(){
            @Override
            //khi firebase tra data
            public void onDataChange(DataSnapshot snapshot){
                if (snapshot.exists()) {
                    SensorData data = snapshot.getValue(SensorData.class);
                    log.info("📊 Received data from {}: {}", device, data);
                    future.complete(data);
                } else {
                    log.warn("⚠️ No data found for device: {}", device);
                    future.complete(null);
                }
            }
            @Override
            // khi firebase loi
            public void onCancelled(DatabaseError error) {
                log.error("❌ Firebase read error: {}", error.getMessage());
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }
    /* Kiem tra ket noi Firebase
     */
    public CompletableFuture<Boolean> testConnection() {
        CompletableFuture<Boolean> future = new CompletableFuture<>();
        /*
        databaseReference.child(".info/connected") 
        là một node đặc biệt do Firebase tự tạo để: kiểm tra client/backend 
        hiện có đang kết nối tới Firebase server hay không.
         */
        databaseReference.child("/fire_system").child("current_status").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                log.info("Firebase connected successfully");
                log.info("Snapshot value: {}", snapshot.getValue());

                future.complete(true);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                log.info("Firebase connected Error: {}", error);
                future.complete(false);
            }
        });
        
        return future;
    }
}
