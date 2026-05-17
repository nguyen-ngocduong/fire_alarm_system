package com.example.backend_fas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import jakarta.annotation.PostConstruct;

import java.io.IOException;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class FirebaseConfig {
    @Value("${firebase.database-url}")
    private String databaseUrl;
    @Value("${firebase.service-account-key-path}")
    private String serviceAccountKeyPath;
    @PostConstruct // khoi tao BE ket noi firebase
    public void initialize(){
        try{
            // su dung Account dc phep truy cap Firebase
            // Đọc file từ classpath (bên trong JAR) thay vì filesystem
            var serviceAccountStream = getClass().getClassLoader()
                .getResourceAsStream(serviceAccountKeyPath);
            
            if (serviceAccountStream == null) {
                throw new IOException("Firebase credentials file not found in classpath: " + serviceAccountKeyPath);
            }
            
            // ket noi BE voi Firebase
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                .setDatabaseUrl(databaseUrl)
                .build();
            if(FirebaseApp.getApps().isEmpty()){
                FirebaseApp.initializeApp(options);
                log.info("✅ Firebase Admin SDK initialized successfully");
                log.info("📡 Database URL: {}", databaseUrl);
            }
        }catch(IOException e){
            log.error("Failed to initialize Firebase Admin SDK ", e);
            throw new RuntimeException("Could not initialize Firebase ", e);
        }
    }
    @Bean //Bean để inject vào Service, truy cập Realtime Database
    public DatabaseReference firebaseDatabase() {
        return FirebaseDatabase.getInstance().getReference();
    }
}
