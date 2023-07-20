import { Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

const Page = () => {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: `Chat #${id}` }} />

      <Text>Chat room #{id}!</Text>
    </>
  );
};

export default Page;
