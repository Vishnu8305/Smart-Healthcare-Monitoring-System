<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=00b4a0&height=200&section=header&text=Smart%20Healthcare%20Monitoring&fontSize=36&fontColor=ffffff&fontAlignY=38&desc=ESP32%20%2B%20MQTT%20%2B%20Doctor-AI&descAlignY=58&descSize=18" width="100%"/>

<br/>

[![ESP32](https://img.shields.io/badge/ESP32-IoT-00b4a0?style=for-the-badge&logo=espressif&logoColor=white)](https://www.espressif.com/)
[![MQTT](https://img.shields.io/badge/MQTT-Protocol-660066?style=for-the-badge&logo=eclipse-mosquitto&logoColor=white)](https://mqtt.org/)
[![Arduino](https://img.shields.io/badge/Arduino-IDE-00979D?style=for-the-badge&logo=arduino&logoColor=white)](https://www.arduino.cc/)
[![AI](https://img.shields.io/badge/Doctor--AI-LLM%20%2B%20RAG-ff6b5b?style=for-the-badge&logo=openai&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-ffd93d?style=for-the-badge)](LICENSE)

<br/>

> **A real-time IoT healthcare ecosystem** that collects patient vitals via ESP32 sensors and feeds them into an AI-powered Doctor assistant for intelligent, multilingual diagnosis support.

<br/>

[🚀 Features](#-features) · [🏗️ Architecture](#️-system-architecture) · [📡 MQTT Topics](#-mqtt-topics) · [⚙️ Hardware](#️-hardware-requirements) · [🛠️ Setup](#️-setup-instructions) · [🧠 Doctor-AI](#-doctor-ai-layer) · [📈 Roadmap](#-roadmap)

</div>

---

## 🌟 What We Built

Most IoT health projects **stop at collecting data**. We asked a better question:

> *What if the data could actually understand you?*

This project combines **real-time IoT vitals monitoring** with an **AI-powered Doctor assistant** — where sensor data feeds directly into an intelligent system that reasons, asks follow-up questions, and generates structured medical reports.

```
ESP32 Sensors  →  MQTT Broker  →  Doctor-AI (LLM + RAG)  →  Patient Report
```

---

## 🚀 Features

### 📡 IoT Hardware Layer
| Feature | Detail |
|---|---|
| ❤️ Heart Rate Monitoring | MAX30102 pulse oximeter |
| 🩸 SpO₂ Measurement | MAX30102 (photoplethysmography) |
| 🌡️ Body Temperature | MLX90614 non-contact IR sensor |
| 📏 Height Detection | HC-SR04 ultrasonic ranging |
| 🩺 Blood Pressure | UART-based BP module |
| 📺 Local OLED Display | SH1106 — shows live readings |
| 🌐 WiFi Connectivity | ESP32 / ESP32-S3 |
| 📡 MQTT Transmission | Lightweight pub/sub to broker |

### 🧠 Doctor-AI Layer
| Feature | Detail |
|---|---|
| 💬 Multi-turn Conversations | Contextual follow-up questions |
| 🔍 RAG Medical Knowledge | Retrieves from clinical knowledge base |
| 📋 Structured Reports | Final assessment + root cause + advice |
| 🇮🇳 Multilingual | Telugu + English voice & text input |
| 🤖 Agentic Reasoning | Doesn't just answer — it thinks |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SENSOR LAYER                             │
│  MAX30102 · MLX90614 · HC-SR04 · UART BP · SH1106 OLED          │
└─────────────────────┬───────────────────────────────────────────┘
                      │ I²C · GPIO · UART
┌─────────────────────▼───────────────────────────────────────────┐
│                   MICROCONTROLLER LAYER                         │
│         ESP32 / ESP32-S3  ·  Arduino IDE / PlatformIO           │
│     WiFi Stack · MQTT Client · Signal Processing · JSON         │
└─────────────────────┬───────────────────────────────────────────┘
                      │ 802.11 WiFi · TCP/IP
┌─────────────────────▼───────────────────────────────────────────┐
│                      NETWORK LAYER                              │
│      WiFi Router → MQTT Broker (Mosquitto / HiveMQ)             │
│   health/hr · health/spo2 · health/temp · health/height         │
│           health/sys · health/dia · health/pulse                │
└─────────────────────┬───────────────────────────────────────────┘
                      │ MQTT Subscribe
┌─────────────────────▼───────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│  Doctor-AI (LLM + RAG)  ·  Node-RED  ·  InfluxDB  ·  Firebase   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Parameters Measured

| Parameter | Sensor | MQTT Topic | Normal Range |
|---|---|---|---|
| ❤️ Heart Rate | MAX30102 | `health/hr` | 60–100 bpm |
| 🩸 SpO₂ | MAX30102 | `health/spo2` | 95–100% |
| 🌡️ Body Temperature | MLX90614 | `health/temp` | 36.1–37.2 °C |
| 📏 Height | HC-SR04 | `health/height` | Up to 400 cm |
| 🩺 Systolic BP | UART BP | `health/sys` | < 120 mmHg |
| 🩺 Diastolic BP | UART BP | `health/dia` | < 80 mmHg |
| 💓 Pulse | UART BP | `health/pulse` | 60–100 /min |

---

## 📡 MQTT Topics

```text
health/spo2    →  98        (SpO₂ percentage)
health/hr      →  75        (Heart rate bpm)
health/temp    →  36.5      (Body temp °C)
health/height  →  170       (Height cm)
health/sys     →  120       (Systolic mmHg)
health/dia     →  80        (Diastolic mmHg)
health/pulse   →  72        (Pulse per min)
```

**Broker options:** Mosquitto (local) · HiveMQ (cloud) · QoS 1 · Retained messages supported

---

## ⚙️ Hardware Requirements

```
ESP32 / ESP32-S3           — Main microcontroller + WiFi
MAX30102                   — Heart rate & SpO₂ (I²C)
MLX90614                   — Non-contact IR temperature (I²C)
HC-SR04                    — Ultrasonic height sensor (GPIO)
UART Blood Pressure Module — Automatic BP cuff (UART)
SH1106 OLED (128×64)       — Local display (I²C)
Jumper wires + power supply
```

**Wiring summary:**

| Sensor | Interface | ESP32 Pins |
|---|---|---|
| MAX30102 | I²C | SDA=21, SCL=22 |
| MLX90614 | I²C | SDA=21, SCL=22 |
| HC-SR04 | GPIO | TRIG=5, ECHO=18 |
| UART BP Module | UART | TX=17, RX=16 |
| SH1106 OLED | I²C | SDA=21, SCL=22 |

### 🔩 Hardware Photos

<p align="center">
  <img src="https://github.com/user-attachments/assets/20bb7c28-d9a5-439c-acc4-0ec342681049" width="32%"/>
  <img src="https://github.com/user-attachments/assets/4877eb44-01be-4054-83da-f8ccb4ab23b2" width="32%"/>
  <img src="https://github.com/user-attachments/assets/86699231-e373-46c9-b9b7-da4e093c03c0" width="32%"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/c7d667cd-b7f6-4f46-936b-def0ea22bb39" width="32%"/>
  <img src="https://github.com/user-attachments/assets/64674867-4509-4722-943c-e29b9bb435dc" width="32%"/>
  <img src="https://github.com/user-attachments/assets/9c3db8e6-6cae-43ac-a56b-0ad9b604fd33" width="32%"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/365c0601-4a97-4665-9774-15362eb727ae" width="32%"/>
  <img src="https://github.com/user-attachments/assets/34708ba0-b20e-402b-907a-70089b97281d" width="32%"/>
  <img src="https://github.com/user-attachments/assets/9442b2e9-410e-4d08-b6eb-e36fbf8d964b" width="32%"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/49e85353-bd05-4875-8b2c-633b152bf111" width="98%"/>
</p>

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone git@github.com:Vishnu8305/Smart-Healthcare-Monitoring-System.git 
cd Smart-Healthcare-Monitoring-System
```

### 2. Install required libraries

Open Arduino IDE → Library Manager and install:

```
PubSubClient          (MQTT client)
Adafruit GFX          (Display graphics)
Adafruit SH110X       (OLED driver)
DFRobot_BloodOxygen_S (MAX30102)
DFRobot_MLX90614      (IR temperature)
WiFi.h                (built-in ESP32)
Wire.h                (built-in ESP32)
```

### 3. Configure credentials

Edit the config section in `main.ino`:

```cpp
// WiFi
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Broker
const char* mqtt_server = "YOUR_BROKER_IP";  // e.g. 192.168.1.100
const int   mqtt_port   = 1883;
```

### 4. Flash to ESP32

1. Connect ESP32 via USB
2. Select board: **ESP32 Dev Module** (or ESP32-S3)
3. Select correct COM port
4. Click **Upload**
5. Open Serial Monitor at **115200 baud**

### 5. Verify output

```
Connecting WiFi............. ✓
MQTT connecting............ ✓
------DATA------
SpO2   : 98 %
HR     : 75 bpm
Temp   : 36.5 °C
Height : 170 cm
BP     : 120/80 mmHg
```

---

## 🧠 Doctor-AI Layer

The AI layer receives real-time vitals over MQTT and powers a conversational medical assistant.

### AI Pipeline

<p align="center">
  <img src="https://github.com/user-attachments/assets/df959d91-201e-42fd-88d6-42ba6da841e3" width="98%"/>
</p>

```
Patient Input (Symptoms + Vitals)
         │
         ▼
   Preprocessing  ──────────────────────────────┐
   (Clean & Format)                             │
         │                               Medical Knowledge Base
         ▼                               (Clinical Documents)
  Agentic Pipeline  ◄──────────────────  RAG Retrieval
  (Logic & Questions)                   (Embeddings + Search)
         │
         ▼
  LLM Processing (Mistral / FLAN-T5)
         │
         ▼
  Diagnosis & Advice  ──►  Report Generation
```

### Multilingual Support

The Doctor-AI understands and responds in both **English** and **Telugu** — making it accessible for patients across Andhra Pradesh and Telangana regions.

---

## 📸 App Screenshots

### 🔐 Login & Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/0d3e6ad7-aa0b-409f-bb9c-78daa3050a35" width="32%"/>
  <img src="https://github.com/user-attachments/assets/dff30d77-f43c-400b-b5d1-11684a109b94" width="64%"/>
</p>

### 🧪 Enter Vitals

<p align="center">
  <img src="https://github.com/user-attachments/assets/53d6e376-a9a1-446f-af66-2cc56e817110" width="98%"/>
</p>

### 💬 Consult Doctor-AI (Multilingual Chat)

<p align="center">
  <img src="https://github.com/user-attachments/assets/de9ad1b1-fdf6-43ad-9ae4-c4b8d989353d" width="49%"/>
  <img src="https://github.com/user-attachments/assets/ad253db2-48fb-4f5a-8ff7-916a725894d7" width="49%"/>
</p>

### 📋 Medical Assessment Report

<p align="center">
  <img src="https://github.com/user-attachments/assets/0daefe66-b8a4-4389-a047-2554ceceb2d8" width="98%"/>
</p>

---

## 📺 OLED Display

Live readings shown on the embedded SH1106 display:

```
┌────────────────┐
│ HR: 75   O2:98 │
│ Temp: 36.5     │
│ BP: 120/85     │
│ Ht: 170  P: 72 │
└────────────────┘
```

---

## 📈 Roadmap

- [x] ESP32 multi-sensor integration
- [x] MQTT real-time transmission
- [x] OLED local display
- [x] Doctor-AI with RAG + Agentic reasoning
- [x] Multilingual chat (Telugu + English)
- [x] Structured medical report generation
- [ ] Node-RED real-time dashboard
- [ ] InfluxDB time-series storage
- [ ] Firebase / AWS cloud sync
- [ ] Mobile app (iOS + Android)
- [ ] Health alert notifications 🚨
- [ ] Wearable device integration
- [ ] Explainable AI for medical transparency

---

## 🧪 Tech Stack

| Layer | Technology |
|---|---|
| Microcontroller | ESP32 / ESP32-S3 |
| Firmware | Arduino IDE / PlatformIO |
| Protocol | MQTT (PubSubClient) |
| Broker | Mosquitto · HiveMQ |
| AI Model | Mistral / FLAN-T5 |
| RAG | Embeddings + semantic search |
| Frontend | React.js (Doctor-AI web app) |
| Display | SH1106 OLED (Adafruit library) |

---

## 🗂️ Project Structure

```
Smart-Healthcare-Monitoring-System/
├── firmware/
│   ├── main.ino              # Main ESP32 sketch
│   ├── sensors/
│   │   ├── max30102.ino      # Heart rate + SpO₂
│   │   ├── mlx90614.ino      # Temperature
│   │   ├── ultrasonic.ino    # Height
│   │   └── bp_uart.ino       # Blood pressure
│   └── mqtt_client.ino       # MQTT publish logic
├── doctor-ai/
│   ├── app.py                # Flask/FastAPI backend
│   ├── rag_pipeline.py       # RAG retrieval logic
│   ├── agent.py              # Agentic reasoning
│   └── report_generator.py   # Structured report output
├── web/
│   ├── src/                  # React frontend
│   └── public/
├── docs/
│   └── architecture.png
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add: your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Pedaballi Vishnu Vardhan Reddy**

*IoT Developer · Embedded Systems Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-Vishnu8305-181717?style=for-the-badge&logo=github)](https://github.com/Vishnu8305)

</div>

---

<div align="center">

**⭐ If this project helped you, please give it a star!**

*Built with ❤️ by students, for better healthcare accessibility*

<img src="https://capsule-render.vercel.app/api?type=waving&color=00b4a0&height=100&section=footer" width="100%"/>

</div>
