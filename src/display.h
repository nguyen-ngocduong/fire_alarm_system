#ifndef DISPLAY_H
#define DISPLAY_H

#include <Arduino.h>
#include <LiquidCrystal_I2C.h>
#include "sensor.h"

void display_init();
void display_show_init();
void display_normal(const SensorData &data);
void display_alert(const SensorData &data);
void display_error(const char* msg);

#endif