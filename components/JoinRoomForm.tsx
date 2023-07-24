import { useCallback, useState } from "react";
import { Button, View } from "react-native";
import { router } from "expo-router";
import { TextInput } from "react-native-gesture-handler";

export const JoinRoomForm = () => {
  const [roomId, setRoomId] = useState("");

  const joinRoom = useCallback(() => {
    router.push(`/chat/${roomId}`);
  }, [roomId]);

  return (
    <View style={{ display: "flex", gap: 16 }}>
      <TextInput
        placeholder="Enter room ID"
        onChangeText={setRoomId}
        style={{ padding: 16, backgroundColor: "#f8f8f8" }}
      />
      <Button title="Join room" onPress={joinRoom} />
    </View>
  );
};
