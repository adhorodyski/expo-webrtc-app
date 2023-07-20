import { View } from "react-native";
import { Stack } from "expo-router";
import { CreateRoomButton } from "../components/CreateRoomButton";
import { JoinRoomForm } from "../components/JoinRoomForm";

const Page = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Chats" }} />

      <View style={{ display: "flex", gap: 32 }}>
        <JoinRoomForm />
        <CreateRoomButton />
      </View>
    </>
  );
};

export default Page;
