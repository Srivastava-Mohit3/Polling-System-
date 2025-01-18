const { Kafka } = require('kafkajs');
const { updateVote } = require('./db');
const { broadcastUpdate } = require('./webSocket');

const kafka = new Kafka({
    clientId: 'polling-app',
    brokers: [process.env.KAFKA_HOST || 'localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'polling-group' });

const setupKafkaProducer = async () => {
    await producer.connect();
    console.log('Kafka Producer is connected');
    return producer;
}

const setupKafkaConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'votes', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let retries = 3;
            while (retries > 0) {
                try {
                    const vote = JSON.parse(message.value.toString());
                    await updateVote(vote.optionId);
                    broadcastUpdate(vote.pollId);
                    break;
                } catch (err) {
                    console.error('Error processing vote:', err);
                    retries--;
                    if (retries === 0) {
                        console.error('Failed to process vote after multiple attempts');
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        },
    });

    console.log('Kafka Consumer is running');
}

module.exports = { setupKafkaProducer, setupKafkaConsumer };

