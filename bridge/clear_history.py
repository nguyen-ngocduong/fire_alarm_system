import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import os
import sys

# Tự động lấy đường dẫn tuyệt đối của file JSON dựa trên vị trí của script này
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_CERT_PATH = os.path.join(SCRIPT_DIR, "fire-alarm-system-61062-firebase-adminsdk-fbsvc-7754ada60c.json")
DATABASE_URL = "https://fire-alarm-system-61062-default-rtdb.asia-southeast1.firebasedatabase.app"

def main():
    print("=== CHƯƠNG TRÌNH XÓA LỊCH SỬ HỆ THỐNG PHÒNG CHÁY ===")
    print(f"Database URL: {DATABASE_URL}")
    print(f"Target node : /fire_system/history")
    print("-" * 50)
    
    # Xác nhận từ người dùng lần 1
    confirm = input("⚠️  Bạn có chắc chắn muốn XÓA TOÀN BỘ lịch sử ghi nhận trong '/fire_system/history' không? (yes/no): ").strip().lower()
    if confirm != 'yes':
        print("❌ Hủy bỏ thao tác xóa lịch sử.")
        sys.exit(0)

    # Xác nhận lần 2 để tránh vô tình gõ nhầm
    double_confirm = input("❗ Hành động này KHÔNG THỂ HOÀN TÁC. Nhập 'CONFIRM' để tiếp tục: ").strip()
    if double_confirm != 'CONFIRM':
        print("❌ Xác nhận không khớp. Hủy bỏ thao tác.")
        sys.exit(0)

    # Khởi tạo Firebase
    if not os.path.exists(FIREBASE_CERT_PATH):
        print(f"❌ Lỗi: Không tìm thấy file thông tin xác thực tại:\n{FIREBASE_CERT_PATH}")
        sys.exit(1)
        
    try:
        print("🔄 Đang kết nối tới Firebase...")
        cred = credentials.Certificate(FIREBASE_CERT_PATH)
        firebase_admin.initialize_app(cred, {
            'databaseURL': DATABASE_URL
        })
        
        # Thực hiện xóa
        print("🗑️  Đang xóa lịch sử ghi nhận...")
        ref = db.reference('/fire_system/history')
        ref.delete()
        
        print("✅ Đã xóa toàn bộ lịch sử trong '/fire_system/history' thành công!")
        
    except Exception as e:
        print(f"❌ Lỗi khi thực hiện xóa trên Firebase: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
