package com.example.backend_fas.security;

import java.util.Base64.Decoder;
import java.util.function.Function;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.backend_fas.User.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.*;

@Service
public class JwtService {
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;
    // Doc tat ca claims (payload)
    private Claims extractAllClaims(String token){
        return Jwts.parser()
            .verifyWith(getSignInKey())   // xác minh chữ ký
            .build()
            .parseSignedClaims(token)     // parse token
            .getPayload();                // lấy payload
    }
    // doc 1 claim cu the
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    // lay UserId tu payload
    public String extractUserId(String token){
        return extractClaim(token, Claims :: getSubject);
    }
    // thoi gian het han
    public Date extractExpiration(String token){
        return extractClaim(token, Claims :: getExpiration);
    }
    // tao token cho phien lam viec 
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails){
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }
    public String generateRefreshToken(UserDetails userDetails){
        return buildToken(new HashMap<>(), userDetails, refreshExpiration);
    }
    // ham tao token
    private String buildToken(Map<String, Object> extraClaims, 
                            UserDetails userDetails, long expiration){
        // Lấy userId (số) thay vì username
        String userId = ((User) userDetails).getId().toString();
    //                                    ▲
    //              Ép kiểu về User entity để lấy id

        return Jwts.builder()
            .claims(extraClaims)          // thêm dữ liệu tùy chọn vào payload
            .subject(userId)              // "sub": "1" (userId)
            .issuedAt(new Date(System.currentTimeMillis()))      // "iat": thời điểm tạo
            .expiration(new Date(System.currentTimeMillis() + expiration))    // "exp": thời điểm hết hạn
            .signWith(getSignInKey(), Jwts.SIG.HS256)  // ký bằng HS256
            .compact();                   // tạo chuỗi JWT
    }
    //Kiem tra token con han
    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }
    //kiem tra token hop le
    public boolean isTokenValid(String token, UserDetails userDetails){
        final String idFromToken = extractUserId(token);
        if(userDetails instanceof User){
            String userId = ((User) userDetails).getId().toString();
            return (idFromToken.equals(userId))   // userId trong token == userId trong DB?
                && !isTokenExpired(token);     // token chưa hết hạn?
        }
        return (idFromToken.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
    // lay secret-key header.payload.signature
    private SecretKey getSignInKey(){
        // giai ma chuoi Base64 tu .env thanh bytes
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
