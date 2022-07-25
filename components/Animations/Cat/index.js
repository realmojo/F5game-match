import React, { useRef, useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

export const Cat = () => {
  const animation = useRef(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    // animation.current?.play();
  }, []);

  return (
    <LottieView
      autoPlay
      ref={animation}
      style={{
        width: 200,
        height: 200,
      }}
      // Find more Lottie files at https://lottiefiles.com/featured
      source={require("./cat.json")}
    />
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});
