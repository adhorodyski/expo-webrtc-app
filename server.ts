import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";

const io = new Server();

const rooms = new Map<
  string,
  {
    owner: string;
    guest: string | null;
  }
>();

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected due to ${reason}`);
  });

  socket.on("create-room", (message) => {
    const roomExists = rooms.has(message.roomId);

    if (roomExists) return;

    rooms.set(message.roomId, {
      owner: message.userId,
      guest: null,
    });

    console.info(`Room ${message.roomId} created.`);
  });

  socket.on("join-room", (message) => {
    const room = rooms.get(message.roomId);

    if (!room) return;

    rooms.set(message.roomId, {
      owner: room.owner,
      guest: message.userId,
    });
  });

  /*
    The initiating peer offers a connection
  */
  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  /*
    The receiving peer answers (accepts) the offer
  */
  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });
});

await serve(io.handler(), {
  port: 8080,
});
