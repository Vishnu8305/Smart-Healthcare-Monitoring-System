import mqtt from "mqtt"

const brokerUrl = "ws://34.100.154.108:9001"

export const client = mqtt.connect(brokerUrl, {
  clientId: "react_health_" + Math.random().toString(16).slice(3),
  clean: true,
  reconnectPeriod: 2000
})

client.on("connect", () => {
  console.log("MQTT Connected")
})

client.on("error", (err) => {
  console.log("MQTT ERROR:", err)
})