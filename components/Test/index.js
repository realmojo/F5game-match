import React from "react";
import { View, StyleSheet, Text } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { Cat } from "../Animations";
// import GradientButton from "react-native-gradient-buttons";
// import styled from "styled-components/native";
// import { Banner } from "../../lib";

export const TestScreen = ({ navigation }) => {
  return (
    <View style={styles.view}>
      <Text style={{ color: "white" }}>123</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    flex: 1,
    color: "white",
    alignItems: "center",
    backgroundColor: "#222B45",
  },
});
