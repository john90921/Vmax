import React from "react";
import { FlatList } from "react-native";

function ThemedFlatList({ style, ...props }) {
  return (
    <FlatList
      style={[style]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
    />
  );
}

export default ThemedFlatList;
