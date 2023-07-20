import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <View style={styles.container}>
      <Slot />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});