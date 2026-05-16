# 🔥 Fire Alarm System - Frontend

Frontend application cho hệ thống báo cháy thông minh sử dụng React 18, Tailwind CSS và Recharts.

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## 📋 Yêu cầu

- Node.js >= 18.0.0
- npm hoặc yarn

## 🔧 Cấu hình

Tạo file `.env` từ `.env.example` và cập nhật các giá trị:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_DEVICE_ID=esp32_fire
VITE_POLLING_INTERVAL=5000
VITE_CONNECTION_CHECK_INTERVAL=30000
```

## 📚 Tài liệu

Xem file `FE_Documentation_FAS.md` trong thư mục `bao_cao` để biết chi tiết về thiết kế và cấu trúc.

## 🎨 Stack công nghệ

- React 18
- React Router v6
- Axios
- Recharts
- Tailwind CSS
- Vite

## 👥 Phân quyền

- **USER**: Xem dashboard, biểu đồ, quản lý profile
- **ADMIN**: Tất cả quyền USER + quản lý người dùng, cấu hình cảnh báo
