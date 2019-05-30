const monitor = require('./service/monitor');

/**
 * Generate new event.
 *
 * @returns
 */
function generateEvent() {
    return {
        deviceId: 'bordin-ubuntu',
        userId: '1',
        temperature: Math.random() * 20 + 10 + Math.random(),
        humidity: Math.random() * 2 + Math.random()
    };
}

// Testing consumer.
monitor.start().then(() => {
    const message = generateEvent()
    
    setInterval(() => monitor.produceMessage(message), 2000);
});