import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const data = [
  { key: "Devin" },
  { key: "Dan" },
  { key: "Dominic" },
  { key: "Jackson" },
  { key: "James" },
  { key: "Joel" },
  { key: "John" },
  { key: "Jillian" },
  { key: "Jimmy" },
  { key: "Julie" },
  { key: "Kate" },
  { key: "Kevin" },
  { key: "Kim" },
  { key: "Kyle" },
  { key: "Laura" },
  { key: "Liam" },
  { key: "Lily" },
  { key: "Lucas" },
  { key: "Mia" },
  { key: "Michael" },
  { key: "Natalie" },
  { key: "Nathan" },
  { key: "Olivia" },
  { key: "Owen" },
  { key: "Rachel" },
  { key: "Ryan" },
  { key: "Sarah" },
  { key: "Sophia" },
  { key: "Thomas" },
  { key: "Victoria" },
];

const SkatesList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    borderColor: "red",
    borderWidth: 5,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: "white",
  },
});

export default SkatesList;
