import { useCallback } from "react";
import { Button } from "react-native";
import { router } from "expo-router";

export const CreateRoomButton = () => {
  const createRoom = useCallback(() => {
    const id = Math.floor(Math.random() * 10_000);
    router.push(`/chat/${id}`);
  }, []);

  return <Button title="Create a chat room" onPress={createRoom} color="red" />;
};
