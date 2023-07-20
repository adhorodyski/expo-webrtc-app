import { Link } from "expo-router";
import { FlatList, View } from "react-native";

const rooms = [
  { id: 1, label: "Games" },
  { id: 2, label: "Sports" },
  { id: 3, label: "Movies" },
];

export const ChatsList = () => {
  return (
    <FlatList
      data={rooms}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 32, padding: 16 }}>
          <Link href={`/chat/${item.id}`}>Join room {item.label}</Link>
        </View>
      )}
    />
  );
};
