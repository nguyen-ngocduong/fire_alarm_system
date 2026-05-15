#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "sensor.h"

void mqtt_init(const char* broker, int port);
void mqtt_loop();
bool mqtt_connect();
void mqtt_publish_data(const SensorData &data);

#endif