#include <Arduino.h>
#include "Wifi_Config.h"
#include "mqtt_client.h"
#include "sensor.h"
#include "display.h"

// Actuators
#define BUZZER_PIN 18
#define LED_PIN 5

// Intervals
unsigned long lastPublishTime = 0;
const unsigned long publishInterval = 5000; // Publish every 5 seconds

void setup() {
  Serial.begin(115200);
  
  // Initialize Display
  display_init();
  display_show_init();

  // Initialize Sensors
  DHT11_init();
  MQ2_Init();
  FlameSensor_Init();

  // Initialize Actuators
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Initialize Network
  Wifi_init();
  
  // Initialize MQTT
  mqtt_init("192.168.1.103", 1883);

  delay(1000);
}

void loop() {
  // 0. Handle Web Server (for Config Portal or AI Alert)
  server.handleClient();

  // 1. Read Sensors
  DHT11_run();
  MQ2_run();
  FlameSensor_Run();

  // 2. Populate SensorData
  SensorData data;
  data.temperature = temp;
  data.humidity = humi;
  data.lpg_ppm = lpg_ppm;
  data.smoke_ppm = smoke_ppm;
  data.gasValue = gasValue;
  data.flameAlert = flameAlert;
  data.irFlameValue = irFlameValue;
  data.irFlameAlert = irFlameAlert;
  
  data.tempAlert = (data.temperature > TEMP_THRESHOLD);
  data.gasAlert = (data.lpg_ppm > LPG_THRESHOLD) || (data.gasValue > GAS_VALUE_THRESHOLD);
  data.anyAlert = data.tempAlert || data.gasAlert || data.flameAlert || data.irFlameAlert;

  // 3. Handle Actuators & Display
  if (data.anyAlert) {
    digitalWrite(BUZZER_PIN, HIGH);
    display_alert(data);
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    display_normal(data);
  }

  // Flame LED logic
  if (data.flameAlert || data.irFlameAlert) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  // 4. Handle Network & MQTT
  if (isWifiConnected()) {
    mqtt_loop();
    
    // Publish telemetry periodically
    if (millis() - lastPublishTime > publishInterval) {
      mqtt_publish_data(data);
      lastPublishTime = millis();
    }
    
    // Also run the AI Alert Server if needed
    AI_Start(); 
  }

  // Serial Debug
  // Serial.print("T: "); Serial.print(data.temperature); Serial.print("C");
  // Serial.print(" | G: "); Serial.print(data.gasValue);
  // Serial.print(" | F: "); Serial.print(data.flameAlert ? "YES" : "NO");
  // Serial.print(" | IR: "); Serial.println(data.irFlameValue);

  delay(1000);
}
