import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./components/Home";
import { GameScreen } from "./components/Game";
import { ScoreScreen } from "./components/Score";
import * as Analytics from "expo-firebase-analytics";
import uuid from "react-native-uuid";

// Set global test device ID
const Stack = createStackNavigator();
const App = () => {
  const uid = uuid.v4();
  Analytics.setClientId(uid);
  useEffect(() => {
    (async () => {
      await Analytics.logEvent("app_view", {
        name: "app_start",
        screen: "APP",
        user: uid,
        purpose: "APP_START",
      });
    })();
  });
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen title="LEVEL" name="Game" component={GameScreen} />
        <Stack.Screen title="SCORE" name="Score" component={ScoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
