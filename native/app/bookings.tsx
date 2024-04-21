import { FlatList, StyleSheet } from "react-native";

import { Text, View } from "@/components/theme/Themed";
import SkatesList from "@/components/features/skates/SkatesList";
import { StyledText } from "@/components/theme/StyledText";

export default function BookingsScreen() {
  return (
    <View style={styles.container}>
      <StyledText
        style={{
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        Bookings
      </StyledText>
      <FlatList
        contentContainerStyle={{
          justifyContent: "space-between",
          gap: 8,
        }}
        data={[
          {
            key: "Monday",
          },
          {
            key: "Wed",
          },
        ]}
        renderItem={({ item }) => <StyledText>{item.key}</StyledText>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 24,
    gap: 24,
  },
});
