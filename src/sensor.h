#ifndef SENSOR_H
#define SENSOR_H

#include <Arduino.h>
#include <DHT.h>

// ==== Thresholds ====
#define TEMP_THRESHOLD 45.0
#define LPG_THRESHOLD 1000.0
#define GAS_VALUE_THRESHOLD 1500

// ==== Data Structure ====
struct SensorData {
    float temperature;
    float humidity;
    float lpg_ppm;
    float smoke_ppm;
    int gasValue;
    bool flameAlert;
    int irFlameValue;
    bool irFlameAlert;
    bool tempAlert;
    bool gasAlert;
    bool anyAlert;
};

// ==== DHT11 ====
extern float temp, humi;
void DHT11_init();
void DHT11_run();

// ==== MQ2 ====
extern float lpg_ppm, smoke_ppm;
extern int gasValue;
void MQ2_Init();
void MQ2_run();

// ==== Flame sensor ====
extern bool flameAlert;
extern int irFlameValue;
extern bool irFlameAlert;
void FlameSensor_Init();
void FlameSensor_Run();

#endif
