import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const Page = () => {
  const { id } = useLocalSearchParams();

  return <Text>Chat room #{id}!</Text>;
};

export default Page;
