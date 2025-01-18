let wss;

const setupWebSocket = (webSocketServer) => {
    wss = webSocketServer;
    wss.on('connection', (ws) => {
        console.log('New WebSocket connection');
        ws.on('message', (message) => {
            console.log('Received message:', message);
        });
    });
}

const broadcastUpdate = (pollId) => {
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'update', pollId }));
            }
        });
    }
}

module.exports = { setupWebSocket, broadcastUpdate };