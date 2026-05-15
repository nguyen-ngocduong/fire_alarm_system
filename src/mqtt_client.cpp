#include "mqtt_client.h"
#include <WiFi.h>
#include <time.h>
#include <ArduinoJson.h>

WiFiClient espClient;
PubSubClient client(espClient);

const char* mqtt_broker = "192.168.1.103";
int mqtt_port = 1883;
const char* topic_data = "fire_system/data";

String getTimestamp()
{
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo))
        return "Unknown";
    char buffer[25];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
    return String(buffer);
}

void mqtt_init(const char* broker, int port) {
    mqtt_broker = broker;
    mqtt_port = port;
    client.setServer(mqtt_broker, mqtt_port);
    Serial.print("MQTT broker: ");
    Serial.println(mqtt_broker);
}

void mqtt_loop() {
    if (!client.connected()) {
        mqtt_connect();
    }
    client.loop();
}

bool mqtt_connect() {
    if (WiFi.status() != WL_CONNECTED) return false;
    
    if (client.connected()) return true;

    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP32FireClient-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
        Serial.println("connected");
        return true;
    } else {
        Serial.print("failed, rc=");
        Serial.print(client.state());
        return false;
    }
}

void mqtt_publish_data(const SensorData &data) {
    if (WiFi.status() != WL_CONNECTED)
        return;
    
    if (!mqtt_connect()) return;

    // Create JSON payload using ArduinoJson
    JsonDocument doc;
    doc["device"] = "esp32_fire";
    doc["temperature"] = data.temperature;
    doc["humidity"] = data.humidity;
    doc["lpg"] = data.lpg_ppm;
    doc["smoke"] = data.smoke_ppm;
    doc["raw_gas"] = data.gasValue;
    doc["flame"] = data.flameAlert;
    doc["ir_flame"] = data.irFlameValue;
    doc["alert"] = data.anyAlert;

    String payload;
    serializeJson(doc, payload);

    if (client.publish(topic_data, payload.c_str()))
        Serial.println("MQTT OK: " + payload);
    else
        Serial.println("MQTT publish FAIL");
}
