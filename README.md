# Hệ Thống Báo Cháy Thông Minh - Fire Alarm System (FAS)

Dự án này là một hệ thống IoT giám sát, cảnh báo và báo động cháy thời gian thực, tích hợp phần cứng ESP32, cầu nối truyền thông MQTT, cơ sở dữ liệu thời gian thực Firebase, dịch vụ Backend Spring Boot bảo mật bằng JWT và giao diện người dùng React (Vite).

---

## 1. Kiến Trúc Tổng Quan (System Architecture)

Hệ thống được thiết kế theo mô hình phân tầng hướng sự kiện và phân tách nhiệm vụ rõ ràng:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Thiết bị phần cứng (ESP32)                      │
│   DHT11 (Nhiệt độ/Độ ẩm) + MQ-2 (Gas/Khói) + Flame IR (Cảm biến lửa)    │
│                        Buzzer + Còi LED + LCD I2C                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Wi-Fi / MQTT
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       MQTT Broker (Mosquitto)                          │
│                      Topic: fire_system/data                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Subscribe
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Python Integration Bridge                       │
│           (Đọc dữ liệu MQTT → Đồng bộ lên Firebase RTDB)               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Firebase SDK
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Firebase Realtime Database (RTDB)                   │
│                    - /fire_system/current_status                       │
│                    - /fire_system/history                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Event Listener / Proxy API
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Spring Boot Backend (Port: 8080)                      │
│ - Tầng bảo mật: Spring Security + JWT Authentication                   │
│ - Tầng xử lý cảnh báo: Spring Mail (SMTP Alert)                        │
│ - Cơ sở dữ liệu người dùng: PostgreSQL (Quản lý User & Role)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API (Bearer JWT)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   React Frontend Client (Vite + Tailwind)               │
│ - Giám sát Real-time Dashboard, Biểu đồ lịch sử (Recharts)             │
│ - Quản lý tài khoản, Vai trò (USER/ADMIN)                              │
│ - Xem nhật ký cảnh báo và cấu hình ngưỡng                              │
└────────────────────────────────────────────────────────────────────────┘
```

### Chi tiết các lớp công nghệ:
1.  **Thiết bị đầu cuối (ESP32)**:
    *   Đọc thông số từ cảm biến nhiệt độ & độ ẩm (DHT11), cảm biến khí gas & khói (MQ-2) và cảm biến phát hiện ngọn lửa (Flame Sensor kỹ thuật số & hồng ngoại analog).
    *   Cảnh báo tại chỗ bằng Buzzer và LED cảnh báo khi phát hiện bất kỳ chỉ số nào vượt ngưỡng.
    *   Cập nhật thông tin lên màn hình LCD I2C 16x2.
    *   Gửi dữ liệu định kỳ mỗi 5 giây sang MQTT Broker qua giao thức MQTT.
2.  **Cầu nối truyền thông (Python Bridge)**:
    *   Sử dụng thư viện `paho-mqtt` để subscribe nhận tin nhắn từ MQTT broker.
    *   Nhận dữ liệu dạng JSON từ ESP32, thêm dấu thời gian nhận (timestamp) và đồng bộ trực tiếp lên Firebase Realtime Database qua Firebase Admin SDK.
3.  **Firebase Realtime Database**:
    *   Đóng vai trò là nguồn dữ liệu thời gian thực duy nhất (Single Source of Truth) cho trạng thái hiện tại của thiết bị và lưu trữ lịch sử để vẽ biểu đồ.
4.  **Backend Server (Spring Boot)**:
    *   Quản lý thông tin tài khoản và phân quyền (Role: `USER`, `ADMIN`) thông qua cơ sở dữ liệu **PostgreSQL** kết hợp cơ chế mã hóa mật khẩu BCrypt và xác thực bằng **JSON Web Token (JWT)** (Access Token & Refresh Token).
    *   Sử dụng Firebase Admin SDK để lắng nghe thời gian thực sự kiện thay đổi dữ liệu từ node cảm biến trên Firebase.
    *   Thực hiện kiểm tra logic ngưỡng cảnh báo tự động: nếu phát hiện cháy/gas rò rỉ, hệ thống tự động kích hoạt gửi Email cảnh báo khẩn cấp qua SMTP (Mailtrap/Gmail).
    *   Cung cấp API Proxy bảo mật cho Frontend (chỉ cho phép các request có Header `Authorization: Bearer <JWT_Token>` truy cập dữ liệu cảm biến).
5.  **Frontend Web App (React + Vite)**:
    *   Thiết kế giao diện hiện đại với **Tailwind CSS**, thư viện hiệu ứng **Framer Motion** và đồ thị phân tích lịch sử **Recharts**.
    *   Nhận dữ liệu thời gian thực và hiển thị biểu đồ diễn biến.
    *   Cho phép quản trị viên cấu hình tài khoản, theo dõi hệ thống.

---

## 2. Kết Nối Sơ Đồ Phần Cứng (Hardware Wiring & Pinout)

Các linh kiện được kết nối với board mạch điều khiển chính **ESP32 DevKit V1** theo cấu hình sau:

| Linh Kiện | Chân Linh Kiện | Chân ESP32 | Chức Năng | Chi tiết cấu hình |
| :--- | :--- | :--- | :--- | :--- |
| **DHT11** | VCC, GND, DATA | **GPIO 4** | Đọc Nhiệt độ & Độ ẩm | Thư viện `Adafruit DHT` |
| **MQ-2 Sensor** | VCC, GND, AO | **GPIO 34** (Analog) | Đọc nồng độ Gas/Khói | Đọc ADC, chuyển đổi PPM |
| **Flame Sensor (D)**| VCC, GND, DO | **GPIO 19** (Digital) | Phát hiện ngọn lửa (kỹ thuật số) | Mức LOW = Phát hiện lửa |
| **Flame Sensor (A)**| VCC, GND, AO | **GPIO 35** (Analog) | Đo cường độ bức xạ lửa | Trạng thái nguy hiểm khi > 3500 |
| **I2C LCD 16x2** | VCC, GND, SDA, SCL| **GPIO 21 (SDA)**, **GPIO 22 (SCL)** | Hiển thị thông tin tại chỗ | Địa chỉ I2C mặc định `0x27` |
| **Buzzer** | Chân tín hiệu | **GPIO 18** | Còi báo động khi có sự cố | Bật mức HIGH khi có cảnh báo |
| **LED Indicator** | Chân tín hiệu | **GPIO 5** | Đèn báo trạng thái lửa | Bật mức HIGH khi phát hiện lửa |

---

## 3. Cấu Trúc Thư Mục Dự Án (Directory Structure)

Thư mục dự án được tổ chức khoa học để quản lý riêng biệt từng thành phần hệ thống:

```
fire_alarm_system/
├── src/                          # Mã nguồn Firmware ESP32 (C++/Arduino)
│   ├── main.cpp                  # Luồng xử lý chính của ESP32 (Setup & Loop)
│   ├── Wifi_Config.cpp / .h      # Cấu hình kết nối Wi-Fi & Web Server cấu hình
│   ├── sensor.cpp / .h           # Khởi tạo, đọc cảm biến (DHT11, MQ-2, Flame) & tính PPM
│   ├── display.cpp / .h          # Điều khiển màn hình LCD I2C
│   └── mqtt_client.cpp / .h      # Kết nối và gửi dữ liệu qua MQTT broker
├── platformio.ini                # File cấu hình PlatformIO (thư viện, board, tốc độ nạp)
│
├── bridge/                       # Cầu nối trung gian (Python)
│   ├── bridge.py                 # Script kết nối MQTT và Firebase Realtime Database
│   ├── clear_history.py          # Script dọn dẹp lịch sử trên Firebase
│   ├── requirements.txt          # Các thư viện Python cần thiết
│   └── fire-alarm-system-...json # File chứng thư Firebase Service Account
│
├── backend_fas/                  # Backend Server (Spring Boot)
│   ├── pom.xml                   # Quản lý dependencies (Maven)
│   ├── Dockerfile                # Cấu hình đóng gói Docker container backend
│   ├── docker-compose.yaml       # Định nghĩa dịch vụ PostgreSQL chạy trên Docker
│   ├── .env                      # File cấu hình biến môi trường cục bộ
│   └── src/main/
│       ├── java/com/example/backend_fas/
│       │   ├── BackendFasApplication.java # Khởi động ứng dụng
│       │   ├── config/           # Cấu hình Firebase, Security, Mail...
│       │   ├── security/         # Bộ lọc JWT Filter, JwtService, SecConfig
│       │   ├── auth/             # Controller, Service và DTOs đăng ký/đăng nhập
│       │   ├── user/             # Controller, Service, Entity cho quản lý người dùng
│       │   └── sensor/           # Xử lý và API Proxy dữ liệu cảm biến từ Firebase
│       └── resources/
│           ├── application.yml   # Cấu hình Spring Boot (DB, Mail, Thresholds)
│           └── db/migration/     # Kịch bản khởi tạo database
│
├── frontend_fas/                 # Frontend Dashboard Client (React + Vite)
│   ├── package.json              # Quản lý các thư viện NPM frontend
│   ├── vite.config.js            # Cấu hình bundler Vite
│   ├── tailwind.config.js        # Cấu hình giao diện CSS Tailwind
│   └── src/
│       ├── App.jsx               # Thành phần gốc điều hướng định tuyến
│       ├── main.jsx              # Điểm khởi chạy của React DOM
│       ├── pages/                # Các trang (Dashboard, History, Profile, Users, Auth)
│       ├── components/           # Các component tái sử dụng (Navbar, Card, Sidebar)
│       └── api/                  # Cấu hình Axios gọi API proxy tới backend
```

---

## 4. Hướng Dẫn Cài Đặt Và Vận Hành (Setup & Installation Guide)

### Yêu cầu tiên quyết
*   **Phần cứng**: Board ESP32 DevKit V1, cảm biến DHT11, MQ-2, Cảm biến Lửa, Buzzer, LED, Màn hình LCD I2C 16x2.
*   **Phần mềm cài đặt**:
    *   [VS Code](https://code.visualstudio.com/) tích hợp plugin [PlatformIO IDE](https://platformio.org/).
    *   [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/).
    *   [Java JDK 17+](https://adoptium.net/).
    *   [Python 3.8+](https://www.python.org/).
    *   [Node.js (LTS)](https://nodejs.org/).
    *   Một Broker MQTT (Ví dụ: Eclipse Mosquitto cài đặt cục bộ hoặc trên máy chủ).

---

### BƯỚC 1: Triển khai MQTT Broker (Mosquitto)
Hệ thống cần một MQTT Broker để tiếp nhận thông tin từ ESP32. Có thể cài đặt nhanh qua Docker:
```bash
docker run -d --name mosquitto -p 1883:1883 -p 9001:9001 eclipse-mosquitto
```
*Lưu ý*: Kiểm tra và sửa cấu hình Mosquitto cho phép kết nối ẩn danh (anonymous access) nếu chạy thử nghiệm nội bộ.

---

### BƯỚC 2: Cài đặt và Chạy Python Bridge
1.  Truy cập thư mục `bridge`:
    ```bash
    cd bridge
    ```
2.  Cài đặt các thư viện cần thiết:
    ```bash
    pip install -r requirements.txt
    ```
3.  Tải file định dạng JSON chứa Service Account key của Firebase từ trang Firebase Console và lưu vào thư mục `bridge`. Sửa đường dẫn tương ứng tại biến `FIREBASE_CERT_PATH` và sửa IP MQTT Broker tương ứng trong `bridge.py`:
    ```python
    MQTT_BROKER = "IP_MÁY_CHẠY_MOSQUITTO"
    DATABASE_URL = "URL_FIREBASE_RTDB"
    ```
4.  Chạy script bridge:
    ```bash
    python bridge.py
    ```

---

### BƯỚC 3: Cấu hình và Chạy Backend (Spring Boot)
1.  Truy cập thư mục `backend_fas`:
    ```bash
    cd backend_fas
    ```
2.  Tạo file `.env` từ file mẫu hoặc cấu hình trực tiếp các biến môi trường sau:
    ```properties
    SERVER_PORT=8081
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5433
    POSTGRES_DB=YOUR_POSTGRES_DATABASE
    POSTGRES_USER=YOUR_POSTGRES_USERNAME
    POSTGRES_PASSWORD=YOUR_POSTGRES_PASSWORD
    
    JWT_SECRET=YOUR_JWT_SECRET_SIGNING_KEY_HEX_STRING_HERE
    JWT_EXPIRATION=86400000
    JWT_REFRESH_EXPIRATION=604800000
    
    FIREBASE_DATABASE_URL=YOUR_FIREBASE_REALTIME_DATABASE_URL
    FIREBASE_SERVICE_ACCOUNT_KEY_PATH=YOUR_FIREBASE_SERVICE_ACCOUNT_JSON_FILENAME
    
    # Cấu hình Mail Server (ví dụ: Mailtrap hoặc Gmail SMTP)
    MAIL_HOST=your_smtp_host
    MAIL_PORT=your_smtp_port
    MAIL_USERNAME=your_smtp_username
    MAIL_PASSWORD=your_smtp_password
    MAIL_FROM_ADDRESS=your_alert_sender_email@example.com
    MAIL_FROM_NAME=your_system_display_name
    ALERT_EMAIL_RECIPIENTS=your_recipient_email@example.com
    
    # Ngưỡng kích hoạt cảnh báo
    ALERT_THRESHOLD_TEMPERATURE=45.0
    ALERT_THRESHOLD_LPG=1000.0
    ALERT_THRESHOLD_RAW_GAS=1500.0
    ALERT_THRESHOLD_IR_FLAME=3500
    ```
3.  Khởi động PostgreSQL bằng Docker:
    ```bash
    docker compose up postgres -d
    ```
4.  Build và chạy ứng dụng Spring Boot:
    ```bash
    # Trên Linux/macOS
    ./mvnw clean package -DskipTests
    ./mvnw spring-boot:run
    
    # Trên Windows
    mvnw.cmd clean package -DskipTests
    mvnw.cmd spring-boot:run
    ```
5.  Mở tài liệu API bằng Swagger UI tại địa chỉ: `http://localhost:8080/swagger-ui/index.html` (hoặc `/swagger-ui.html`).

---

### BƯỚC 4: Cấu hình và Chạy Frontend (React + Vite)
1.  Truy cập thư mục `frontend_fas`:
    ```bash
    cd frontend_fas
    ```
2.  Cài đặt các gói npm:
    ```bash
    npm install
    ```
3.  Tạo file `.env` chứa URL gọi API đến Backend:
    ```env
    VITE_API_URL=http://localhost:8080/api/v1
    ```
4.  Khởi động máy chủ phát triển cục bộ:
    ```bash
    npm run dev
    ```
5.  Mở trình duyệt truy cập ứng dụng tại: `http://localhost:5173`.

---

### BƯỚC 5: Nạp chương trình cho ESP32 (Firmware)
1.  Mở toàn bộ thư mục gốc dự án bằng **VS Code** có cài PlatformIO.
2.  Chỉnh sửa thông số Wi-Fi và địa chỉ IP của MQTT Broker trong file `src/main.cpp` (dòng 37):
    ```cpp
    mqtt_init("IP_CỦA_MÁY_CHẠY_BROKER", 1883);
    ```
3.  Kết nối board ESP32 vào máy tính.
4.  Nhấp vào biểu tượng PlatformIO ở thanh công cụ dưới góc trái màn hình:
    *   Chọn **Build** để biên dịch mã nguồn.
    *   Chọn **Upload** để nạp chương trình vào board ESP32.
5.  Mở **Serial Monitor** với baudrate `115200` để xem log khởi tạo cảm biến, kết nối Wi-Fi, kết nối MQTT broker và quá trình gửi dữ liệu.

---

## 5. Đặc Tả Thiết Kế Cơ Sở Dữ Liệu (Database Schema)

### 5.1. Cơ sở dữ liệu quan hệ (PostgreSQL)
Được thiết kế để lưu trữ người dùng và cấu trúc tổ chức bảo mật.

#### Bảng `users` (Quản lý người dùng)
| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL / BIGINT | PRIMARY KEY | Khóa chính tự tăng |
| `username` | VARCHAR(100) | UNIQUE, NOT NULL | Tên tài khoản đăng nhập |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Địa chỉ email nhận cảnh báo |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu được mã hóa BCrypt |
| `role` | VARCHAR(50) | NOT NULL | Vai trò người dùng (`USER`, `ADMIN`) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian khởi tạo tài khoản |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Thời gian cập nhật thông tin |

---

### 5.2. Cơ sở dữ liệu thời gian thực (Firebase Realtime Database)
Dữ liệu trạng thái cảm biến được lưu dưới dạng cây JSON phẳng nhằm tối ưu hóa hiệu suất đọc/ghi tốc độ cao:

```json
{
  "fire_system": {
    "current_status": {
      "temperature": 28.5,
      "humidity": 65.0,
      "gasValue": 350,
      "lpg_ppm": 12.5,
      "smoke_ppm": 8.2,
      "flameAlert": false,
      "irFlameValue": 1024,
      "irFlameAlert": false,
      "tempAlert": false,
      "gasAlert": false,
      "anyAlert": false,
      "server_timestamp": "2026-06-21 21:10:05"
    },
    "history": {
      "-O1aBCxYz...": {
        "temperature": 28.5,
        "humidity": 65.0,
        "gasValue": 350,
        "lpg_ppm": 12.5,
        "smoke_ppm": 8.2,
        "flameAlert": false,
        "irFlameValue": 1024,
        "irFlameAlert": false,
        "tempAlert": false,
        "gasAlert": false,
        "anyAlert": false,
        "server_timestamp": "2026-06-21 21:10:05"
      }
    }
  }
}
```

---

## 6. Luồng Dữ Liệu Thực Tế Hệ Thống (Workflow & Scenarios)

### 6.1. Luồng truyền nhận dữ liệu thông số định kỳ (Telemetry Flow)
1.  **ESP32** kích hoạt định kỳ mỗi 5 giây: đọc thông số từ các cảm biến nhiệt độ DHT11, MQ-2 và Flame.
2.  Thông số thô và giá trị quy đổi (PPM) được đóng gói thành một đối tượng JSON.
3.  ESP32 publish JSON này lên topic `fire_system/data` của MQTT Broker.
4.  **Python Bridge** nhận được gói tin từ topic MQTT, chèn thêm trường `server_timestamp` biểu thị thời gian đồng bộ.
5.  Python Bridge gửi yêu cầu cập nhật (HTTP/WebSocket) tới Firebase Realtime Database tại nút `/fire_system/current_status` và push thêm một bản ghi vào nút `/fire_system/history`.
6.  Trình duyệt người dùng (React Dashboard) nhận dữ liệu thay đổi trực tiếp từ Firebase hoặc thông qua Backend API Proxy để cập nhật số liệu hiển thị trên màn hình.

### 6.2. Luồng phát hiện cháy và cảnh báo (Alert Flow)
1.  Khi có sự cố (Nhiệt độ > 45°C, hoặc nồng độ Gas vượt ngưỡng, hoặc cảm biến lửa phát hiện tia lửa):
    *   **ESP32** ngay lập tức thiết lập cờ `anyAlert = true`.
    *   ESP32 trực tiếp kích hoạt chân xuất **GPIO 18** làm còi **Buzzer** kêu liên tục, đồng thời bật **GPIO 5** phát sáng **LED cảnh báo**.
    *   Màn hình LCD I2C 16x2 lập tức chuyển sang chế độ hiển thị `!!! WARNING !!!` kèm theo phân loại sự cố (Ví dụ: `FLAME DETECTED!`).
2.  Dữ liệu cảnh báo được gửi nhanh lên Firebase thông qua MQTT và Bridge.
3.  **Spring Boot Backend** đang chạy một Listener Firebase nhận biết thuộc tính `anyAlert = true` hoặc giá trị vượt ngưỡng:
    *   Kích hoạt dịch vụ **JavaMailSender** để soạn thảo email cảnh báo khẩn cấp (với các thông tin cụ thể về nhiệt độ, mức độ khói, rò rỉ khí gas).
    *   Gửi email ngay lập tức đến danh sách các email quản trị viên cấu hình sẵn (nhờ Mail Server tích hợp).
    *   *(Tùy chọn nâng cấp)* Đẩy tin nhắn thông báo dạng Push Notification tới các thiết bị di động đã đăng ký Firebase Cloud Messaging (FCM).

### 6.3. Luồng kiểm soát và API bảo mật (Security & JWT Flow)
1.  Người dùng sử dụng Web App gửi thông tin Đăng nhập (`POST /api/v1/auth/authenticate`).
2.  Backend xác thực tài khoản từ PostgreSQL. Nếu thông tin chính xác, Backend sử dụng lớp `JwtService` tạo ra một cặp chuỗi mã hóa: **Access Token** (hết hạn trong 24 giờ) và **Refresh Token** (hết hạn trong 7 ngày).
3.  Frontend nhận về cặp token này và lưu trữ cục bộ trong bộ nhớ trình duyệt.
4.  Đối với mọi request lấy dữ liệu cảm biến hoặc cấu hình, Frontend đính kèm Header `Authorization: Bearer <Access_Token>`.
5.  `JwtAuthenticationFilter` trong Backend chặn request, trích xuất token, đối sánh chữ ký khóa bí mật. Nếu hợp lệ, cho phép request đi qua và truy xuất dữ liệu cảm biến trả về cho Frontend.
6.  Nếu Access Token hết hạn, Frontend gửi yêu cầu `/refresh-token` kèm theo Refresh Token để tự động nhận Access Token mới mà không bắt người dùng phải đăng nhập lại.

---

## 7. Các Tính Năng Nổi Bật Của Hệ Thống

*   **Đồng bộ hóa thời gian thực cực nhanh**: Nhờ kiến trúc sử dụng cầu nối trung gian đẩy dữ liệu lên Firebase Realtime Database qua WebSocket giúp dữ liệu cập nhật gần như không có độ trễ trên web.
*   **Bảo mật dữ liệu tối đa**: Nhờ cơ chế API Proxy, client (Frontend/Mobile) không tương tác trực tiếp với Firebase hoặc Database chứa tài khoản, ngăn ngừa hoàn toàn nguy cơ lộ các API Key hoặc cấu hình máy chủ cơ sở dữ liệu.
*   **Tiết kiệm tài nguyên phần cứng**: Tận dụng cơ sở dữ liệu NoSQL đám mây giúp Spring Boot backend tối giản bộ nhớ lưu trữ, PostgreSQL chỉ tập trung lưu trữ các dữ liệu cấu trúc ít biến động như tài khoản và lịch sử cảnh báo cốt lõi.
*   **Tính cơ động và khả năng phục hồi**: Hệ thống phần cứng ESP32 được cấu hình cơ chế tự động kết nối lại (Auto-reconnect Wi-Fi và MQTT Broker) khi xảy ra sự cố mất mạng, đảm bảo tính liên tục của hệ thống an toàn.
