import { Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

const Page = () => {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: id.toString() }} />

      <Text>Chat room {id}!</Text>
    </>
  );
};

export default Page;
