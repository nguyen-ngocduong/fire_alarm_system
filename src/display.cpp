#include "display.h"
#include <Wire.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void display_init() {
    Wire.begin(21, 22);
    lcd.init();
    lcd.backlight();
}

void display_show_init() {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Fire Alert Sys");
    lcd.setCursor(0, 1);
    lcd.print("Initializing...");
}

void display_normal(const SensorData &data) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("T:");
    lcd.print(data.temperature, 1);
    lcd.print((char)223);
    lcd.print("C H:");
    lcd.print((int)data.humidity);
    lcd.print("%");

    lcd.setCursor(0, 1);
    lcd.print("L:");
    lcd.print((int)data.lpg_ppm);
    lcd.print(" S:");
    lcd.print((int)data.smoke_ppm);
}

void display_alert(const SensorData &data) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("!!! WARNING !!!");
    lcd.setCursor(0, 1);

    if (data.flameAlert || data.irFlameAlert) {
        lcd.print("FLAME DETECTED!");
    } 
    else if (data.gasAlert) {
        lcd.print("GAS LEAK ALERT");
    } 
    else if (data.tempAlert) {
        lcd.print("HIGH TEMP FIRE");
    }
}

void display_error(const char* msg) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("System Error!");
    lcd.setCursor(0, 1);
    lcd.print(msg);
}
