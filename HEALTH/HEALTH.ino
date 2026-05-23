#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include "DFRobot_BloodOxygen_S.h"
#include <DFRobot_MLX90614.h>

/* ---------------- WIFI ---------------- */

const char* ssid = "KLEF";
const char* password = "";
const char* mqtt_server = "10.56.61.141";

/* ---------------- MQTT ---------------- */

WiFiClient espClient;
PubSubClient client(espClient);

/* ---------------- OLED ---------------- */

#define SDA_PIN 8
#define SCL_PIN 9

Adafruit_SH1106G display(128, 64, &Wire, -1);

/* ---------------- MAX30102 ---------------- */

#define MAX30102_ADDR 0x57
DFRobot_BloodOxygen_S_I2C MAX30102(&Wire, MAX30102_ADDR);

/* ---------------- MLX90614 ---------------- */

DFRobot_MLX90614_I2C mlx(0x5A, &Wire);

/* ---------------- ULTRASONIC ---------------- */

#define TRIG_PIN 4
#define ECHO_PIN 2
#define SENSOR_HEIGHT_CM 200.0

/* ---------------- VARIABLES ---------------- */

int spo2 = 0;
int hr = 0;

float bodyTemp = 0;
float objectTemp = 0;
float heightCm = 0;

String sys = "";
String dia = "";
String pulse = "";

/* ---------------- WIFI CONNECT ---------------- */

void connectWiFi()
{
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.println("Connecting WiFi...");
  WiFi.begin(ssid, password);

  unsigned long start = millis();

  while (WiFi.status() != WL_CONNECTED && millis() - start < 5000)
  {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("\nWiFi Connected");
    Serial.println(WiFi.localIP());
  }
  else
  {
    Serial.println("\nWiFi Failed");
  }
}

/* ---------------- MQTT CONNECT ---------------- */

void connectMQTT()
{
  if (!client.connected() && WiFi.status() == WL_CONNECTED)
  {
    Serial.print("MQTT connecting...");

    if (client.connect("ESP32_HealthMonitor"))
    {
      Serial.println("connected");
    }
    else
    {
      Serial.println("failed");
    }
  }
}

/* ---------------- ULTRASONIC ---------------- */

float measureDistanceCM()
{
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 45000);

  if (duration == 0) return -1;

  return (duration * 0.0343) / 2;
}

float getHeight()
{
  float d = measureDistanceCM();

  if (d < 40 || d > 190) return -1;

  return SENSOR_HEIGHT_CM - d;
}

/* ---------------- SETUP ---------------- */

void setup()
{
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, 17);

  Wire.begin(SDA_PIN, SCL_PIN);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  /* OLED */

  display.begin(0x3C, true);
  display.clearDisplay();
  display.setTextColor(SH110X_WHITE);

  display.setTextSize(2);
  display.setCursor(20,20);
  display.println("HEALTH");
  display.display();

  delay(2000);

  /* MAX30102 */

  while (!MAX30102.begin())
  {
    Serial.println("MAX30102 retry...");
    delay(1000);
  }

  MAX30102.sensorStartCollect();

  /* MLX */

  while (mlx.begin() != 0)
  {
    Serial.println("MLX retry...");
    delay(1000);
  }

  connectWiFi();
  client.setServer(mqtt_server, 1883);

  Serial.println("System Ready");
}

/* ---------------- LOOP ---------------- */

void loop()
{
  connectWiFi();
  connectMQTT();

  client.loop();

  /* -------- SENSOR READ -------- */

  MAX30102.getHeartbeatSPO2();

  spo2 = MAX30102._sHeartbeatSPO2.SPO2;
  hr = MAX30102._sHeartbeatSPO2.Heartbeat;

  bodyTemp = MAX30102.getTemperature_C();

  objectTemp = mlx.getObjectTempCelsius();

  float h = getHeight();

  if (h > 50 && h < 200)
    heightCm = h;

  /* -------- BLOOD PRESSURE UART -------- */

  if (Serial2.available())
  {
    String data = Serial2.readStringUntil('\n');

    if (data.startsWith("success,"))
    {
      data.remove(0,8);
      data.trim();

      int c1 = data.indexOf(',');
      int c2 = data.indexOf(',', c1 + 1);

      if (c1 != -1 && c2 != -1)
      {
        sys = data.substring(0, c1);
        dia = data.substring(c1 + 1, c2);
        pulse = data.substring(c2 + 1);
      }
    }
  }

  /* -------- OLED MEDICAL UI -------- */

  display.clearDisplay();

  display.setTextSize(1.5);

  display.setCursor(0,0);
  display.print("HR:");
  display.print(hr);

  display.setCursor(70,0);
  display.print("O2:");
  display.print(spo2);

  display.setCursor(0,25);
  display.print("Temp:");
  display.print(objectTemp,1);

  display.setCursor(70,25);
  display.print("H:");
  display.print(heightCm,0);

  display.setCursor(0,50);
  display.print("BP:");
  display.print(sys);
  display.print("/");
  display.print(dia);

  display.setCursor(70,50);
  display.print("P:");
  display.print(pulse);

  display.display();

  /* -------- SERIAL DEBUG -------- */

  Serial.println("------DATA------");

  Serial.print("SpO2: ");
  Serial.println(spo2);

  Serial.print("HR: ");
  Serial.println(hr);

  Serial.print("Temp: ");
  Serial.println(objectTemp);

  Serial.print("Height: ");
  Serial.println(heightCm);

  Serial.print("SYS: ");
  Serial.println(sys);

  Serial.print("DIA: ");
  Serial.println(dia);

  Serial.print("Pulse: ");
  Serial.println(pulse);

  /* -------- MQTT -------- */

  if (client.connected())
  {
    client.publish("health/spo2", String(spo2).c_str());
    client.publish("health/hr", String(hr).c_str());
    client.publish("health/temp", String(objectTemp).c_str());
    client.publish("health/height", String(heightCm).c_str());
    client.publish("health/sys", sys.c_str());
    client.publish("health/dia", dia.c_str());
    client.publish("health/pulse", pulse.c_str());
  }

  delay(1000);
}