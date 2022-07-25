import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import styled from "styled-components/native";
import { IconButton } from "react-native-paper";
import RNModal from "react-native-modal";
import stores from "../../stores";
import { convertTime } from "../../lib";

const ScoreItem = styled.TouchableOpacity`
  padding: 14px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  flex: 1;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const TitleText = styled.Text`
  flex: 1;
`;
const TimeText = styled.Text`
  flex: 1;
  text-align: right;
`;
const RNModalView = styled.View`
  justify-content: center;
  align-items: center;
  background-color: white;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 3.84px;
  elevation: 5;
  padding-top: 10px;
`;
const RNModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 10px;
`;
const GameoverButtonWrap = styled.View`
  flex-direction: row;
`;

const RNModalNextButtonLeft = styled.TouchableOpacity`
  border-top-width: 1px;
  border-top-color: #ddd;
  border-right-width: 1px;
  border-right-color: #ddd;
  padding-vertical: 15px;
  flex: 1;
`;
const RNModalNextButtonRight = styled.TouchableOpacity`
  border-top-width: 1px;
  border-top-color: #ddd;
  border-right-color: #ddd;
  padding-vertical: 15px;
  flex: 1;
`;

const RNModalNextButtonText = styled.Text`
  color: #111;
  font-size: 18px;
  text-align: center;
`;

export const ScoreScreen = ({ navigation }) => {
  const [isResetVisible, setIsResetVisible] = useState(false);
  const [scoreItems, setScoreItems] = useState([]);

  const doReset = async () => {
    await stores.game.setLevel(1);
    await stores.game.initScore();
    setIsResetVisible(false);
  };

  useEffect(() => {
    (async () => {
      const data = await stores.game.getScore();
      setScoreItems(data);
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableHighlight>
            <IconButton
              icon="delete"
              size={24}
              color="#e67575"
              onPress={() => setIsResetVisible(true)}
            />
          </TouchableHighlight>
          <RNModal
            isVisible={isResetVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
          >
            <RNModalView>
              <RNModalTitle>Are you sure reset?</RNModalTitle>
              <GameoverButtonWrap>
                <RNModalNextButtonLeft onPress={() => setIsResetVisible(false)}>
                  <RNModalNextButtonText>No</RNModalNextButtonText>
                </RNModalNextButtonLeft>
                <RNModalNextButtonRight onPress={() => doReset()}>
                  <RNModalNextButtonText>Okay</RNModalNextButtonText>
                </RNModalNextButtonRight>
              </GameoverButtonWrap>
            </RNModalView>
          </RNModal>
        </View>
      ),
    });
  });
  return (
    <>
      {scoreItems.length ? (
        <SafeAreaView>
          <ScrollView>
            {scoreItems.map((item) => (
              <ScoreItem key={item.level.toString()}>
                <TitleText>LEVEL {item.level}</TitleText>
                <TimeText style={{ textAlign: "right" }}>
                  {convertTime(item.time)}
                </TimeText>
              </ScoreItem>
            ))}
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItem: "center",
            flexDirection: "row",
            marginTop: 30,
          }}
        >
          <Text>No Score</Text>
        </View>
      )}
    </>
  );
};
