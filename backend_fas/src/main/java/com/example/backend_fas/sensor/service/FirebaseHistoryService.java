package com.example.backend_fas.sensor.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Service;

import com.example.backend_fas.sensor.dto.SensorData;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseHistoryService {
    private final DatabaseReference databaseReference;
    public static DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    /**
     * Lấy tất cả lịch sử từ Firebase /fire_system/history
     */
    public CompletableFuture<List<SensorData>> getAllHistory(){
        CompletableFuture<List<SensorData>> future = new CompletableFuture<>();
        DatabaseReference historyRef = databaseReference.child("fire_system").child("history");
        historyRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot){
                if(!snapshot.exists()){
                    log.warn("⚠️ No history data found in Firebase");
                    future.complete(new ArrayList<>());
                    return;
                }
                List<SensorData> historyList = new ArrayList<>();
                for(DataSnapshot child : snapshot.getChildren()){
                    try{
                        SensorData data = child.getValue(SensorData.class);
                        if (data != null) {
                            historyList.add(data);
                        }
                    }catch(Exception e){
                        log.error("❌ Error parsing history record: {}", e.getMessage());
                    }
                }
                historyList.sort((a,b) -> {
                    try {
                        LocalDateTime timeA = parseTimestamp(a.getServer_timestamp());
                        LocalDateTime timeB = parseTimestamp(b.getServer_timestamp());
                        return timeB.compareTo(timeA);
                    } catch (Exception e) {
                        return 0;
                    }
                });
                future.complete(historyList);
            }
            @Override
            public void onCancelled(DatabaseError error){
                log.error("❌ Firebase read error: {}", error.getMessage());
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }
    /*Chuyen server time thanh dang FORMATTER */
    private LocalDateTime parseTimestamp(String server_time){
        if(server_time == null || server_time.isEmpty()){
            return LocalDateTime.now();
        }
        try{
            return LocalDateTime.parse(server_time, FORMATTER); // chuyen server_time => dang format
        }catch(Exception e){
            log.warn("Failed to parse timestamp: {}", server_time);
            return LocalDateTime.now();
        }
    }
    public CompletableFuture<List<SensorData>> getLatestRecords(int limit){
        /**
         * Lấy N bản ghi gần nhất
         */
        return getAllHistory().thenApply(history -> {
            List<SensorData> target = new ArrayList<>();
            for(int i = 0; i<Math.min(limit, history.size()); i++){
                target.add(history.get(i));
            }
            return target;
        });
    }
    public CompletableFuture<List<SensorData>> getHistoryBetween(LocalDateTime starTime, LocalDateTime endTime){
        /*
        * Lấy N bản ghi tu startTime den endTime
         */
        return getAllHistory().thenApply(history ->{
            List<SensorData> target = new ArrayList<>();
            for(SensorData data : history){
                LocalDateTime time = parseTimestamp(data.getServer_timestamp());
                if(time != null && !time.isBefore(starTime) && !time.isAfter(endTime)){
                    target.add(data);
                }
            }
            return target;
        });
    }
    public CompletableFuture<List<SensorData>> getRecentHistory(int hours){
        /*
        * Lấy lịch sử trong N giờ gần nhất
         */
        LocalDateTime cutoff = LocalDateTime.now().minusHours(hours);
        return getAllHistory().thenApply(history -> {
            List<SensorData> target = new ArrayList<>();
            for(SensorData data : history){
                LocalDateTime time = parseTimestamp(data.getServer_timestamp());
                if(time != null && !time.isBefore(cutoff)){
                    target.add(data);
                }
            }
            return target;
        });
    } 
}
