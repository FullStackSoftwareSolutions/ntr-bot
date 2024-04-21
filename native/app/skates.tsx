import { StyleSheet } from "react-native";

import { Text, View } from "@/components/theme/Themed";
import SkatesList from "@/components/features/skates/SkatesList";

export default function SkatesScreen() {
  return (
    <View style={styles.container}>
      <Text>skates</Text>
      <SkatesList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
