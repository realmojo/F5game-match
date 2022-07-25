import React from "react";
import LottieView from "lottie-react-native";

export const Loader = () => {
  return <LottieView source={require("./loader.json")} autoPlay loop />;
};
