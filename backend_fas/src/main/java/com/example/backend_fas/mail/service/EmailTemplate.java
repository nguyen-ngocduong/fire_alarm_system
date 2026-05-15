package com.example.backend_fas.mail.service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/*Tạo template HTML cho email cảnh báo:
 */
import com.example.backend_fas.sensor.dto.SensorResponse;
public class EmailTemplate {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm::ss");
    public static String buildAlertEmail(String deviceId, SensorResponse data, String reason) {
        LocalDateTime now = LocalDateTime.now();
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; }
                    .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
                    .data-table { width: 100%%; border-collapse: collapse; margin: 15px 0; }
                    .data-table th { background: #6c757d; color: white; padding: 10px; text-align: left; }
                    .data-table td { padding: 10px; border-bottom: 1px solid #dee2e6; }
                    .danger { color: #dc3545; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚨 CẢNH BÁO CHÁY</h1>
                    </div>
                    <div class="content">
                        <div class="alert-box">
                            <strong>⚠️ Lý do cảnh báo:</strong> %s
                        </div>
                        
                        <h3>Thông tin thiết bị:</h3>
                        <p><strong>Device ID:</strong> %s</p>
                        <p><strong>Thời gian:</strong> %s</p>
                        
                        <h3>Dữ liệu cảm biến:</h3>
                        <table class="data-table">
                            <tr>
                                <th>Thông số</th>
                                <th>Giá trị</th>
                                <th>Trạng thái</th>
                            </tr>
                            <tr>
                                <td>🌡️ Nhiệt độ</td>
                                <td>%.2f °C</td>
                                <td class="%s">%s</td>
                            </tr>
                            <tr>
                                <td>💨 LPG</td>
                                <td>%.2f ppm</td>
                                <td class="%s">%s</td>
                            </tr>
                            <tr>
                                <td>☁️ Gas (Raw)</td>
                                <td>%.2f</td>
                                <td class="%s">%s</td>
                            </tr>
                            <tr>
                                <td>🔥 IR Flame</td>
                                <td>%d</td>
                                <td class="%s">%s</td>
                            </tr>
                        </table>
                        
                        <p><strong>Trạng thái cảnh báo:</strong> <span class="danger">%s</span></p>
                        
                        <div class="alert-box">
                            <strong>📋 Hành động khuyến nghị:</strong>
                            <ul>
                                <li>Kiểm tra ngay khu vực thiết bị</li>
                                <li>Liên hệ đội phản ứng khẩn cấp</li>
                                <li>Sơ tán nếu cần thiết</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Email tự động từ Fire Alarm System</p>
                        <p>Không trả lời email này</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                reason,
                deviceId,
                now.format(FORMATTER),
                data.getTemperature(), getStatusClass(data.getTemperature(), 45.0), getStatusText(data.getTemperature(), 45.0),
                data.getLpg(), getStatusClass(data.getLpg(), 1000.0), getStatusText(data.getLpg(), 1000.0),
                data.getRaw_gas(), getStatusClass(data.getRaw_gas(), 1500.0), getStatusText(data.getRaw_gas(), 1500.0),
                data.getIr_flame() != null ? data.getIr_flame() : 0, 
                getStatusClassInt(data.getIr_flame(), 3500), 
                getStatusTextInt(data.getIr_flame(), 3500),
                data.getAlert() ? "NGUY HIỂM" : "CẢNH BÁO"
            );
    }
    
    private static String getStatusClass(Double value, Double threshold) {
        if (value == null) return "";
        return value > threshold ? "danger" : "";
    }

    private static String getStatusText(Double value, Double threshold) {
        if (value == null) return "N/A";
        return value > threshold ? "⚠️ Vượt ngưỡng" : "✅ Bình thường";
    }
    
    private static String getStatusClassInt(Integer value, Integer threshold) {
        if (value == null) return "";
        return value > threshold ? "danger" : "";
    }

    private static String getStatusTextInt(Integer value, Integer threshold) {
        if (value == null) return "N/A";
        return value > threshold ? "⚠️ Phát hiện lửa" : "✅ Bình thường";
    }
}
