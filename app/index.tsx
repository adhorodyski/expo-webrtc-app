import { Stack } from "expo-router";
import { ChatsList } from "../components/ChatsList";

const Page = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Chats" }} />

      <ChatsList />
    </>
  );
};

export default Page;
