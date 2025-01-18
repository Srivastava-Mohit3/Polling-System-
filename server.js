const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const { setupKafkaProducer, setupKafkaConsumer } = require('./kafka');
const { pollRoutes } = require('./routes/pollRoute');
const { setupWebSocket } = require('./webSocket');
const { connectToDatabase } = require('./db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

const startServer = async () => {
    try {
        await connectToDatabase();
        const producer = await setupKafkaProducer();
        await setupKafkaConsumer();

        app.get("/", (req, res) => {
            res.status(200).json({message: "App is live"})
        })
        app.use("/api", pollRoutes(producer));

        setupWebSocket(wss);

        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer()