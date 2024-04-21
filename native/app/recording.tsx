import { StyleSheet } from "react-native";

import { Text, View } from "@/components/theme/Themed";
import SkatesList from "@/components/features/skates/SkatesList";
import { StyledText } from "@/components/theme/StyledText";

export default function RecordingScreen() {
  return (
    <View style={styles.container}>
      <StyledText>Recording....</StyledText>
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
