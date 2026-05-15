package com.example.backend_fas.User.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.example.backend_fas.base.entity.BaseEntity;
import com.example.backend_fas.User.enums.Role;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends BaseEntity implements UserDetails{
    @Column(nullable = false, unique = true)
    private String username; // not null, not duplicated
    @Column(nullable = false, unique = true)
    private String email; //not null, not duplicated
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
         // Trả về danh sách quyền, ví dụ: ["ROLE_USER"] hoặc ["ROLE_ADMIN"]
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword(){
        return this.password;
    }
    public String getUsername(){
        return this.username;
    }
    // Ba method dưới đây trả về true = tài khoản hợp lệ
    @Override
    public boolean isAccountNonExpired(){
        return true;
    }
    @Override
    public boolean isAccountNonLocked(){
        return true;
    }
    @Override 
    public boolean isCredentialsNonExpired(){
        return true;
    }
}
