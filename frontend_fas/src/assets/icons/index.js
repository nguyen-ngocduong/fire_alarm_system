// Alert Icons
import alarmIcon from './alerts/alarm.svg';
import bellIcon from './alerts/bell.svg';
import dangerIcon from './alerts/danger.svg';
import fireAlertIcon from './alerts/fire-alert.svg';
import gasAlertIcon from './alerts/gas-alert.svg';
import notificationIcon from './alerts/notification.svg';
import sirenIcon from './alerts/siren.svg';
import warningIcon from './alerts/warning.svg';

// Navigation Icons
import analyticsIcon from './navigation/analytics.svg';
import chartIcon from './navigation/chart.svg';
import dashboardIcon from './navigation/dashboard.svg';
import historyIcon from './navigation/history.svg';
import logoutIcon from './navigation/logout.svg';
import menuIcon from './navigation/menu.svg';
import profileIcon from './navigation/profile.svg';
import settingsIcon from './navigation/settings.svg';

// Sensor Icons
import flameIcon from './sensors/flame.svg';
import gasIcon from './sensors/gas.svg';
import humidityIcon from './sensors/humidity.svg';
import infraredIcon from './sensors/infrared.svg';
import pressureIcon from './sensors/pressure.svg';
import smokeIcon from './sensors/smoke.svg';
import temperatureIcon from './sensors/temperature.svg';

// Status Icons
import connectedIcon from './status/connected.svg';
import disconnectedIcon from './status/disconnected.svg';
import errorIcon from './status/error.svg';
import loadingIcon from './status/loading.svg';
import offlineIcon from './status/offline.svg';
import onlineIcon from './status/online.svg';
import successIcon from './status/success.svg';
import syncIcon from './status/sync.svg';

// System Icons
import apiIcon from './system/api.svg';
import cloudIcon from './system/cloud.svg';
import databaseIcon from './system/database.svg';
import esp32Icon from './system/esp32.svg';
import firebaseIcon from './system/firebase.svg';
import mqttIcon from './system/mqtt.svg';
import serverIcon from './system/server.svg';
import wifiIcon from './system/wifi.svg';

// User Icons
import adminIcon from './users/admin.svg';
import editUserIcon from './users/edit-user.svg';
import lockIcon from './users/lock.svg';
import mailIcon from './users/mail.svg';
import shieldIcon from './users/shield.svg';
import userGroupIcon from './users/user-group.svg';
import userIcon from './users/user.svg';

export const alertIcons = {
  alarm: alarmIcon,
  bell: bellIcon,
  danger: dangerIcon,
  fireAlert: fireAlertIcon,
  gasAlert: gasAlertIcon,
  notification: notificationIcon,
  siren: sirenIcon,
  warning: warningIcon,
};

export const navigationIcons = {
  analytics: analyticsIcon,
  chart: chartIcon,
  dashboard: dashboardIcon,
  history: historyIcon,
  logout: logoutIcon,
  menu: menuIcon,
  profile: profileIcon,
  settings: settingsIcon,
};

export const sensorIcons = {
  flame: flameIcon,
  gas: gasIcon,
  humidity: humidityIcon,
  infrared: infraredIcon,
  pressure: pressureIcon,
  smoke: smokeIcon,
  temperature: temperatureIcon,
};

export const statusIcons = {
  connected: connectedIcon,
  disconnected: disconnectedIcon,
  error: errorIcon,
  loading: loadingIcon,
  offline: offlineIcon,
  online: onlineIcon,
  success: successIcon,
  sync: syncIcon,
};

export const systemIcons = {
  api: apiIcon,
  cloud: cloudIcon,
  database: databaseIcon,
  esp32: esp32Icon,
  firebase: firebaseIcon,
  mqtt: mqttIcon,
  server: serverIcon,
  wifi: wifiIcon,
};

export const userIcons = {
  admin: adminIcon,
  editUser: editUserIcon,
  lock: lockIcon,
  mail: mailIcon,
  shield: shieldIcon,
  userGroup: userGroupIcon,
  user: userIcon,
};

// Export all icons
export default {
  alert: alertIcons,
  navigation: navigationIcons,
  sensor: sensorIcons,
  status: statusIcons,
  system: systemIcons,
  user: userIcons,
};
