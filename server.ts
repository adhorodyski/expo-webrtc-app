import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";

const io = new Server();

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected due to ${reason}`);
  });

  socket.on("test", (message) => {
    console.log(message);
  });
});

await serve(io.handler(), {
  port: 8080,
});
