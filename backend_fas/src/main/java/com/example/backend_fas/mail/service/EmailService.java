package com.example.backend_fas.mail.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.backend_fas.sensor.dto.SensorData;
import org.springframework.beans.factory.annotation.Value;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.UnsupportedEncodingException;
import java.util.*;
/*
Service này có nhiệm vụ:
- gui mail canh bao -> user
- gửi email HTML
- gửi đến nhiều người nhận
-  gửi email test
-  log trạng thái gửi mail
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${alert.email.from}")
    private String fromEmail;
    @Value("$alert.email.from-name")
    private String fromName;
    @Value("${alert.email.recipients}")
    private String recipients;
    public void sendAlertEmail(String deviceId, SensorData data, String reason){
        /*
        * Gửi email cảnh báo cháy đến danh sách người nhận.
        @param deviceId ID của thiết bị gửi cảnh báo
        @param data dữ liệu cảm biến hiện tại
        @param reason nguyên nhân kích hoạt cảnh báo
         */
        try{
            List<String> recipientList = Arrays.asList(recipients.split(","));
            for(String recipient : recipientList){
                sendEmail(deviceId, data, recipient.trim(), reason);
            }
            log.info("✅ Alert email sent successfully to {} recipients", recipientList.size());
        }catch(Exception e){
            log.error("❌ Failed to send alert email ", e);
        }
    }
    private void sendEmail(String deviceId, SensorData data, String to, String reason) throws MessagingException, UnsupportedEncodingException {
        /*
        * Đây là hàm gửi email thực tế.
        * @param to địa chỉ email người nhận
        * @param deviceId ID của thiết bị gửi cảnh báo
        * @param data dữ liệu cảm biến hiện tại
        * @param reason nguyên nhân gây cảnh báo
        * @throws MessagingException nếu xảy ra lỗi khi tạo hoặc gửi email
         */
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, fromName);
        helper.setTo(to);
        helper.setSubject("🚨 CẢNH BÁO CHÁY - " + deviceId);
        
        // Chuyển đổi SensorData sang SensorResponse để dùng trong template
        com.example.backend_fas.sensor.dto.SensorResponse response = com.example.backend_fas.sensor.dto.SensorResponse.fromSensorData(deviceId, data);
        helper.setText(EmailTemplate.buildAlertEmail(deviceId, response, reason), true);
        
        mailSender.send(message);
        try{
            Thread.sleep(10000);
        }catch (InterruptedException e){
            Thread.currentThread().interrupt();
        }
        log.info("📧 Email sent to: {}", to);
    }
    public void testEmail(String to) throws MessagingException, UnsupportedEncodingException{
        /*Dùng để:test cấu hình mail và kiểm tra SMTP hoạt động
         */
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail, fromName);
        helper.setTo(to);
        helper.setSubject("Test Email - Fire Alarm System");
        helper.setText("<h1>Test Email</h1><p>Email configuration is working correctly!</p>", true);

        mailSender.send(message);
        log.info("✅ Test email sent to: {}", to);
    }
}
