# Fire Alarm System - Icon Library

Thư viện icon SVG cho hệ thống báo cháy với animation CSS.

## 📁 Cấu trúc thư mục

```
icons/
├── sensors/          # Icon cảm biến (7 icons)
├── status/           # Icon trạng thái (8 icons)
├── alerts/           # Icon cảnh báo (8 icons)
├── navigation/       # Icon điều hướng (8 icons)
├── users/            # Icon người dùng (7 icons)
├── system/           # Icon hệ thống (8 icons)
├── icon-animations.css  # CSS animations
└── README.md         # Tài liệu này
```

## 🎨 Cách sử dụng

### 1. Import Icon trong React

```jsx
import TemperatureIcon from '@/assets/icons/sensors/temperature.svg';
import FireAlertIcon from '@/assets/icons/alerts/fire-alert.svg';
import OnlineIcon from '@/assets/icons/status/online.svg';

// Sử dụng với img tag
<img src={TemperatureIcon} alt="Temperature" className="icon" />

// Hoặc với React component (nếu dùng SVGR)
import { ReactComponent as TempIcon } from '@/assets/icons/sensors/temperature.svg';
<TempIcon className="icon icon-temperature" />
```

### 2. Import CSS Animations

```jsx
// Trong main.jsx hoặc App.jsx
import '@/assets/icons/icon-animations.css';
```

### 3. Áp dụng Animation

```jsx
// Fire alert với animation pulse
<img 
  src={FireAlertIcon} 
  alt="Fire Alert" 
  className="icon icon-fire-alert" 
/>

// Bell với animation ringing
<img 
  src={BellIcon} 
  alt="Notification" 
  className="icon icon-bell" 
/>

// Loading spinner
<img 
  src={LoadingIcon} 
  alt="Loading" 
  className="icon icon-loading" 
/>

// Sync với rotation
<img 
  src={SyncIcon} 
  alt="Syncing" 
  className="icon icon-sync" 
/>
```

## 🎭 Danh sách Animation

### Alert Animations
- `.icon-fire-alert` - Pulsing effect (nhấp nháy)
- `.icon-siren` - Rotating flash (xoay nhấp nháy)
- `.icon-bell` - Ringing animation (lắc chuông)
- `.icon-warning` - Blink effect (nhấp nháy cảnh báo)
- `.icon-danger` - Shake effect (rung lắc)

### Status Animations
- `.icon-loading` - Spinning (xoay tròn)
- `.icon-sync` - Rotating (xoay đồng bộ)
- `.icon-online` - Pulse glow (phát sáng)
- `.icon-offline` - Fade (mờ dần)
- `.icon-connected` - Success pulse (nhấp nháy thành công)

### Sensor Animations
- `.icon-flame` - Flicker effect (nhấp nháy ngọn lửa)
- `.icon-smoke` - Rising effect (khói bay lên)
- `.icon-gas` - Disperse effect (khí tỏa ra)
- `.icon-temperature` - Thermometer pulse (nhấp nháy nhiệt kế)

### System Animations
- `.icon-wifi` - Signal waves (sóng tín hiệu)
- `.icon-mqtt` - Data flow (luồng dữ liệu)
- `.icon-firebase` - Flame pulse (phát sáng)

## 📏 Kích thước Icon

```jsx
// Small (16x16)
<img src={icon} className="icon icon-sm" />

// Default (24x24)
<img src={icon} className="icon" />

// Medium (32x32)
<img src={icon} className="icon icon-md" />

// Large (48x48)
<img src={icon} className="icon icon-lg" />
```

## 🎨 Thay đổi màu sắc

Tất cả icon sử dụng `currentColor`, có thể thay đổi màu qua CSS:

```css
/* Màu đỏ cho cảnh báo */
.alert-icon {
  color: #ef4444;
}

/* Màu xanh cho online */
.online-icon {
  color: #10b981;
}

/* Màu xám cho offline */
.offline-icon {
  color: #6b7280;
}
```

## 🎯 State Modifiers

```jsx
// Active state
<img src={icon} className="icon icon-active" />

// Disabled state
<img src={icon} className="icon icon-disabled" />

// Error state
<img src={icon} className="icon icon-error" />

// Success state
<img src={icon} className="icon icon-success" />
```

## 🔧 Utility Classes

```jsx
// Hover effect
<img src={icon} className="icon icon-hover" />

// Pause animation on hover
<img src={icon} className="icon icon-fire-alert icon-pause-on-hover" />

// Slow animation
<img src={icon} className="icon icon-loading icon-slow" />

// Fast animation
<img src={icon} className="icon icon-sync icon-fast" />

// No animation
<img src={icon} className="icon icon-fire-alert icon-no-animation" />

// Rotate
<img src={icon} className="icon icon-rotate-90" />
<img src={icon} className="icon icon-rotate-180" />

// Flip
<img src={icon} className="icon icon-flip-h" />
<img src={icon} className="icon icon-flip-v" />
```

## 💡 Ví dụ thực tế

### Dashboard Sensor Card

```jsx
<div className="sensor-card">
  <img 
    src={TemperatureIcon} 
    alt="Temperature" 
    className="icon icon-md icon-temperature icon-hover"
    style={{ color: '#ef4444' }}
  />
  <span>28°C</span>
</div>
```

### Alert Notification

```jsx
<div className="alert-notification">
  <img 
    src={FireAlertIcon} 
    alt="Fire Alert" 
    className="icon icon-lg icon-fire-alert"
    style={{ color: '#dc2626' }}
  />
  <span>Fire Detected!</span>
</div>
```

### Status Indicator

```jsx
<div className="status-indicator">
  {isOnline ? (
    <img 
      src={OnlineIcon} 
      alt="Online" 
      className="icon icon-sm icon-online"
      style={{ color: '#10b981' }}
    />
  ) : (
    <img 
      src={OfflineIcon} 
      alt="Offline" 
      className="icon icon-sm icon-offline"
      style={{ color: '#6b7280' }}
    />
  )}
</div>
```

### Loading State

```jsx
<button disabled>
  <img 
    src={LoadingIcon} 
    alt="Loading" 
    className="icon icon-sm icon-loading"
  />
  Processing...
</button>
```

## 🎨 CSS Variables

Bạn có thể định nghĩa màu sắc global:

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #06b6d4;
}
```

## 📦 Icon List

### Sensors (7)
- temperature.svg
- humidity.svg
- smoke.svg ⭐ (Updated - wave design)
- gas.svg
- flame.svg
- infrared.svg
- pressure.svg

### Status (8)
- online.svg
- offline.svg
- connected.svg
- disconnected.svg
- success.svg
- error.svg
- loading.svg
- sync.svg

### Alerts (8)
- warning.svg
- danger.svg
- alarm.svg
- siren.svg
- bell.svg
- notification.svg
- fire-alert.svg
- gas-alert.svg

### Navigation (8)
- dashboard.svg
- chart.svg
- analytics.svg
- history.svg
- settings.svg
- profile.svg
- logout.svg
- menu.svg

### Users (7)
- user.svg
- admin.svg
- shield.svg
- user-group.svg
- edit-user.svg
- lock.svg
- mail.svg

### System (8)
- esp32.svg
- wifi.svg
- mqtt.svg
- firebase.svg
- database.svg
- server.svg
- cloud.svg
- api.svg

## 🚀 Performance Tips

1. **Lazy load icons**: Chỉ import icon khi cần
2. **Use sprite sheets**: Cho nhiều icon nhỏ
3. **Optimize SVG**: Đã được tối ưu với stroke-width: 2
4. **Reduce animations**: Tắt animation trên thiết bị yếu

```css
@media (prefers-reduced-motion: reduce) {
  .icon {
    animation: none !important;
  }
}
```

## 📝 Notes

- Tất cả icon đều responsive và scalable
- Sử dụng `stroke` thay vì `fill` để dễ customize
- Compatible với dark mode (dùng currentColor)
- Accessible với alt text
