import { StyleSheet } from "react-native";

import { View } from "@/components/theme/Themed";
import { Link } from "expo-router";
import { CalendarDaysIcon, VideoIcon } from "lucide-react-native";
import Button from "@/components/ui/Button";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Link href="/bookings" asChild>
        <Button startIcon={CalendarDaysIcon}>Bookings</Button>
      </Link>
      <Link href="/recording" asChild>
        <Button startIcon={VideoIcon}>Recording</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 24,
    gap: 8,
  },
  link: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    gap: 8,
    borderRadius: 5,
    backgroundColor: "rgb(225, 225, 229)",
  },
});
