import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Linking,
  Alert,
} from "react-native";
import RNModal from "react-native-modal";
import { IconButton } from "react-native-paper";
import styled from "styled-components/native";
import stores from "../../stores";

const RNModalView = styled.View`
  justify-content: center;
  align-items: center;
  background-color: white;
  elevation: 5;
  flex-direction: row;
`;

const OptionItem = styled.TouchableOpacity`
  padding: 18px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const DATA = [
  {
    id: "score",
    title: "SCORE",
  },
  {
    id: "more",
    title: "MORE GAME",
  },
  {
    id: "vibration",
    title: "VIBRATION",
  },
];
const moreGameUrl = "https://play.google.com/store/apps/developer?id=F5+Game";
const OpenURLText = ({ url, text }) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Text onPress={handlePress}>{text}</Text>;
};
export const Option = ({ navigation: { navigate } }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [vibrationText, setVibrationText] = useState(
    stores.game.isVibration ? "OFF" : "ON"
  );

  const setVibration = () => {
    stores.game.setVibration();
    setVibrationText(vibrationText === "OFF" ? "ON" : "OFF");
  };

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const renderItem = ({ item }) => {
    return (
      <>
        {item.id === "score" ? (
          <OptionItem
            onPress={() => {
              setIsVisible();
              navigate("Score");
            }}
          >
            <Text>{item.title}</Text>
          </OptionItem>
        ) : null}
        {item.id === "more" ? (
          <OptionItem>
            <OpenURLText url={moreGameUrl} text={item.title} />
          </OptionItem>
        ) : null}
        {item.id === "vibration" ? (
          <OptionItem onPress={() => setVibration()}>
            <Text>
              {item.title} {vibrationText}
            </Text>
          </OptionItem>
        ) : null}
      </>
    );
  };

  return (
    <View>
      <TouchableHighlight>
        <IconButton
          icon="dots-horizontal"
          size={30}
          onPress={() => toggleModal()}
        />
      </TouchableHighlight>

      <RNModal
        isVisible={isVisible}
        animationInTiming={100}
        onBackButtonPress={() => toggleModal()}
        onBackdropPress={() => toggleModal()}
      >
        <RNModalView>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </RNModalView>
      </RNModal>
    </View>
  );
};
