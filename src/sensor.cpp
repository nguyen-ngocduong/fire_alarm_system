#include "sensor.h"
#include <math.h>


// Pins (Defined here for use in .cpp)
#define DHTPIN       4
#define DHTTYPE      DHT11
#define MQ2_PIN      34
#define FLAME_PIN    19
#define IR_FLAME_PIN 35

// Global Variables Definitions
float temp = 0, humi = 0;
float lpg_ppm = 0, smoke_ppm = 0;
int gasValue = 0;
bool flameAlert = false;
int irFlameValue = 0;
bool irFlameAlert = false;

// Hardware Objects
DHT dht(DHTPIN, DHTTYPE);

// MQ2 Constants (Voltage Divider & Log-Log)
const float VCC = 5.0;      
const float ADC_REF = 3.3;  
const int ADC_MAX = 4095;   
const float RL = 10000.0;   // 10kOhm load resistor
float R0_MQ2 = 10000.0;     // Initial guess, will be calibrated

// Clean air factor (Rs/R0 in clean air)
const float READ_AIR_FACTOR = 9.83;

// Coefficients for MQ2 (Log-Log model)
const float M_LPG   = -0.47; 
const float B_LPG   = 1.31;
const float M_SMOKE = -0.44;
const float B_SMOKE = 1.59;

// Internal Helpers
float read_adc_avg(int pin, int samples = 10) {
    uint32_t sum = 0;
    for (int i = 0; i < samples; i++) {
        sum += analogRead(pin);
        delay(10);
    }
    return (float)sum / samples;
}

float rs_ro_to_ppm(float rs_ro, float m, float b) {
    if (rs_ro <= 0) return -1;
    float log_ppm = (log10(rs_ro) - b) / m;
    return pow(10, log_ppm);
}

// ==== DHT11 ====
void DHT11_init() {
    dht.begin();
}

void DHT11_run() {
    humi = dht.readHumidity();
    temp = dht.readTemperature();
    
    if (isnan(humi) || isnan(temp)) {
        Serial.println("❌ Failed to read from DHT sensor!");
    }
}

// ==== MQ2 ====

float MQ2_Calibrate(int pin) {
    Serial.println("--- MQ2 Calibrating (Clean Air) ---");
    float rs_sum = 0;
    for (int i = 0; i < 50; i++) {
        float adc = analogRead(pin);
        float vout = (adc / ADC_MAX) * ADC_REF;
        // Rs = ((Vcc - Vout) * RL) / vout
        float rs = (vout > 0.1) ? ((VCC - vout) * RL) / vout : 1000000;
        rs_sum += rs;
        delay(50);
    }
    float rs_avg = rs_sum / 50.0;
    float r0 = rs_avg / READ_AIR_FACTOR;
    return r0;
}

void MQ2_Init() {
    analogSetPinAttenuation(MQ2_PIN, ADC_11db);
    pinMode(MQ2_PIN, INPUT);
    
    // Perform calibration at startup
    R0_MQ2 = MQ2_Calibrate(MQ2_PIN);
    Serial.print("MQ2 Calibration Done. R0 = ");
    Serial.println(R0_MQ2);
}

void MQ2_run() {
    float adc_avg = read_adc_avg(MQ2_PIN);
    gasValue = (int)adc_avg;
    
    // Voltage for PPM calculation
    float vout = (adc_avg / ADC_MAX) * ADC_REF;
    // Rs = ((Vcc - Vout) * RL) / vout
    float rs = (vout > 0.01) ? ((VCC - vout) * RL) / vout : 1000000;
    
    // Log-Log Regression Model
    float ratio = rs / R0_MQ2;
    lpg_ppm = rs_ro_to_ppm(ratio, M_LPG, B_LPG);
    smoke_ppm = rs_ro_to_ppm(ratio, M_SMOKE, B_SMOKE);
}

// ==== Flame Sensor ====
void FlameSensor_Init() {
    pinMode(FLAME_PIN, INPUT);
    pinMode(IR_FLAME_PIN, INPUT);
    analogSetPinAttenuation(IR_FLAME_PIN, ADC_11db);
}

void FlameSensor_Run() {
    // Digital Sensor: LOW = Flame detected
    flameAlert = (digitalRead(FLAME_PIN) == LOW);

    // Analog Sensor: High value = Flame detected (as per user, up to 4095)
    irFlameValue = analogRead(IR_FLAME_PIN);
    irFlameAlert = (irFlameValue > 3500); // Threshold 3500 as per user's example
}
