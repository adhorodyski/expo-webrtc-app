import { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { socket } from "../lib/socket";

export const Chat = () => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View>
      <Text>newwww Chat</Text>
      <Button
        title="send"
        onPress={() => {
          socket.emit("test", 123);
        }}
      />
    </View>
  );
};
