import * as websocket from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const PORT = 8080;

const wss = new websocket.WebSocketServer(PORT);

wss.on("connection", (client) => {
  client.on("message", (message) => {
    console.log(message);
    client.send(message);
  });
});

console.log(`WebSocket server is running at ws://localhost:${PORT} 🚀`);
