import paho.mqtt.client as mqtt
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
import os
from datetime import datetime

# ==== Cấu hình MQTT ====
MQTT_BROKER = "192.168.1.103" # Đảm bảo IP này là IP máy chạy Mosquitto
MQTT_PORT = 1883
MQTT_TOPIC = "fire_system/data"

# ==== Cấu hình Firebase ====
# Tự động lấy đường dẫn tuyệt đối của file JSON dựa trên vị trí của script này
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_CERT_PATH = os.path.join(SCRIPT_DIR, "fire-alarm-system-61062-firebase-adminsdk-fbsvc-7754ada60c.json")
DATABASE_URL = "https://fire-alarm-system-61062-default-rtdb.asia-southeast1.firebasedatabase.app"

# Khởi tạo Firebase
if os.path.exists(FIREBASE_CERT_PATH):
    cred = credentials.Certificate(FIREBASE_CERT_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': DATABASE_URL
    })
else:
    print(f"Lỗi: Không tìm thấy file {FIREBASE_CERT_PATH}")
    exit(1)

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("✅ Kết nối MQTT Broker THÀNH CÔNG!")
        client.subscribe(MQTT_TOPIC)
        print(f"📡 Đang đợi dữ liệu từ ESP32 trên topic: {MQTT_TOPIC}...")
    else:
        print(f"❌ Kết nối thất bại, mã lỗi: {rc}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"📩 [{datetime.now().strftime('%H:%M:%S')}] Nhận dữ liệu: {payload}")

        if "timestamp" not in payload:
            payload["server_timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Đẩy lên Firebase
        db.reference('/fire_system/current_status').set(payload)
        db.reference('/fire_system/history').push(payload)
        print("🔥 Đã đồng bộ lên Firebase!")

    except Exception as e:
        print(f"⚠️ Lỗi xử lý dữ liệu: {e}")

# Sử dụng CallbackAPIVersion.VERSION2 để hết cảnh báo
client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message

print("🚀 Đang khởi động Bridge...")
try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_forever()
except Exception as e:
    print(f"💥 Lỗi: {e}")
