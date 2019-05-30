require('dotenv').config();

module.exports = {
    elasticId: process.env.ELASTIC_ID,
    elasticUser: process.env.ELASTIC_USER,
    elasticPass: process.env.ELASTIC_PASS,
    kafkaBrokers: process.env.KAFKA_BROKERS.split(','),
    kafkaTopic: process.env.KAFKA_TOPIC,
    kafkaConcurrency: process.env.KAFKA_CONCURRENCY,
    kafkaGroupId: process.env.KAFKA_GROUP_ID,
    kafkaFromBegning: process.env.KAFKA_FROM_BEGINNING === "true"
};