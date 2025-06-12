const mqtt = require('mqtt');
module.exports = mqtt.connect(process.env.MQTT_BROKER_URL);

const mqttSub = mqtt.connect(process.env.MQTT_BROKER_URL);
mqttSub.on('connect', () => mqttSub.subscribe('tasks/updates'));
mqttSub.on('message', (topic, msg) => {
  const data = JSON.parse(msg.toString());
  io.emit('taskUpdated', data);
});
module.exports = mqttSub;
