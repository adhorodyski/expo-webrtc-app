import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";

const io = new Server();

/**
 * A map of room IDs to room objects.
 * Each room object contains the owner's socket ID and the guest's socket ID.
 */
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

  socket.on("join-room", (roomId: string) => {
    const room = rooms.get(roomId);

    // If the room doesn't exist, create one
    if (!room) {
      rooms.set(roomId, {
        owner: socket.id,
        guest: null,
      });

      console.log(`Created room: ${roomId}`, rooms.get(roomId));

      return;
    }

    // If the room exists, join it as a guest
    rooms.set(roomId, {
      owner: room.owner,
      guest: socket.id,
    });

    console.log(`Joined room: ${roomId}`, rooms.get(roomId));

    // Notify the other user that someone has joined the room
    const otherUser = room.owner === socket.id ? room.guest : room.owner;

    if (!otherUser) return;

    socket.emit("other-user", otherUser);
    io.to(otherUser).emit("user-joined", socket.id);
  });

  // The initiating peer offers a connection
  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  // The receiving peer answers (accepts) the offer
  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  // The initiating peer sends an ICE candidate to the receiving peer
  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });
});

await serve(io.handler(), { port: 8080 });
