package com.example.backend_fas.base.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@MappedSuperclass // không tạo bảng riêng, chỉ để kế thừa
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntity implements Serializable{
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY) //auto tang
    private Long id;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist // chay tu dong truoc khi insert
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate // chay tu dong truoc khi update
    protected void onUpdate(){
        this.updatedAt = LocalDateTime.now();
    }
}
