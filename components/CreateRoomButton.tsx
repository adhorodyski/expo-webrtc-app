import { useCallback } from "react";
import { Button } from "react-native";
import { router } from "expo-router";
import { randomUUID } from "expo-crypto";
import { socket } from "../lib/socket";

export const CreateRoomButton = () => {
  const createRoom = useCallback(() => {
    const id = randomUUID();
    socket.emit("create-room", { roomId: id });
    router.push(`/chat/${id}`);
  }, []);

  return <Button title="Create a chat room" onPress={createRoom} color="red" />;
};
