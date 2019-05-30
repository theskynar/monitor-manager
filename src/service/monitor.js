const { Kafka } = require('kafkajs');
const config = require('../config');
const repository = require('../repository/monitor');
const Event = require('../model/event');

/**
 * Monitor service using kafka.
 *
 * @class MonitorService
 */
class MonitorService {
    /**
     * Creates an instance of MonitorService.
     * 
     * @memberof MonitorService
     */
    constructor() {
        this._kafka = new Kafka({
            clientId: 'monitor-manager',
            brokers: config.kafkaBrokers
        });

        this._consumer = this._kafka.consumer({
            groupId: config.kafkaGroupId,
            allowAutoTopicCreation: true
        });

        this._producer = this._kafka.producer({
            allowAutoTopicCreation: true
        });;
    }

    /**
     * Start service.
     *
     * @memberof MonitorService
     */
    async start() {
        // Start repository.
        await repository.start();

        // Start kafka connect.
        await this._consumer.connect();
        await this._consumer.subscribe({ topic: config.kafkaTopic, fromBeginning: config.kafkaFromBegning });

        // Run kafka.
        this._consumer.run({
            partitionsConsumedConcurrently: parseInt(config.kafkaConcurrency),
            eachMessage: async ({ message }) => await this.onMessage(message)
        });

        console.log('Monitor service initialized successfuly');
    }

    /**
     * Dispose service.
     *
     * @memberof MonitorService
     */
    async dispose() {
        await this._consumer.disconnect();
    }

    /**
     * Called on new message received in topic.
     *
     * @param {*} msg Message received.
     * @memberof MonitorService
     */
    async onMessage(body) {
        const msg = JSON.parse(body.value);
        console.log(`Message received: ${msg}`);
        const { error, value } = Event.validate(msg);

        if (error) {
            console.log(`Message received is invalid`);
            throw new Error('The message received is invalid');
        }

        await repository.indexEvent(value);
    }

    /**
     * Produce message in topic.
     *
     * @param {*} msg
     * @memberof MonitorService
     */
    async produceMessage(...msg) {
        console.log('Producing new message...');

        await this._producer.send({
            topic: config.kafkaTopic,
            messages: msg.map(x => ({ value: JSON.stringify(x) }))
        });
    }
}

module.exports = new MonitorService();