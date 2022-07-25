import React, { useState, useEffect, useLayoutEffect } from "react";
import { Counter } from "./Counter";
import { Option } from "./Option";
import { View, Dimensions, Vibration } from "react-native";
import { observer } from "mobx-react";
import stores from "../../stores";
import RNModal from "react-native-modal";

import styled from "styled-components/native";
import BackImage from "../../assets/background.png";
import { Banner, Interstitial } from "../../lib";
import { Congratulation } from "../Animations";
import * as Analytics from "expo-firebase-analytics";

const containerPadding = 10;
const tilePadding = 3;
const screen = Dimensions.get("screen");

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${containerPadding}px;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const ContainerWrap = styled.ImageBackground`
  flex: 1;
  resize-mode: cover;
  justify-content: center;
`;

const Tile = styled.View`
  width: 25%;
  padding: ${tilePadding}px;
`;

const InnerTile = styled.TouchableOpacity`
  height: 100%;
  border-radius: 2px;
  width: 100%;
  border: 1px solid #aaa;
  background: #293244;
`;

const TileImage = styled.ImageBackground`
  flex: 1;
  background: #293244;
  opacity: 0;
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
  width: 300px;
  margin 0 auto;
`;
const RNModalTitle = styled.Text`
  font-size: 26px;
  font-weight: bold;
  padding-bottom: 10px;
`;

const RNModalDescription = styled.Text`
  margin-bottom: 10px;
`;

const RNModalAdmob = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const RNModalButtonWrap = styled.View`
  flex-direction: row;
`;

const RNModalNextButton = styled.TouchableOpacity`
  background-color: #222f3e;
  padding-vertical: 15px;
  flex: 1;
`;

const RNModalNextButtonLeft = styled.TouchableOpacity`
  background-color: #222f3e;
  border-top-width: 1px;
  border-top-color: #383f48;
  border-right-width: 1px;
  border-right-color: #383f48;
  padding-vertical: 15px;
  flex: 1;
`;
const RNModalNextButtonRight = styled.TouchableOpacity`
  background-color: #222f3e;
  border-top-width: 1px;
  border-top-color: #383f48;
  padding-vertical: 15px;
  flex: 1;
`;

const RNModalNextButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  text-align: center;
`;

export const GameScreen = observer(({ navigation }) => {
  const [gameClearModalVisible, setGameClearModalVisible] = useState(false);
  const [gameClearModalButtonVisible, setGameClearModalButtonVisible] =
    useState(false);
  const [gameOverModalVisible, setGameOverModalVisible] = useState(false);
  const [gameOverModalButtonVisible, setGameOverModalButtonVisible] =
    useState(false);

  const [isClick, setIsClick] = useState(false);
  const [isStart, setIsStart] = useState(true);
  const [counter, setCounter] = useState(0);
  const [time, setTime] = useState(3);
  const [adTime, setAdTime] = useState(0);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [gameLevel, setGameLevel] = useState(0);
  const [prevItems, setPrevNumber] = useState({
    key: null,
    number: null,
  });
  const { items } = stores.game;
  const column = items.length === 4 ? 2 : 4;
  const tileWidthPercent = items.length === 4 ? "50%" : "25%";
  const tileHeight =
    (screen.width - containerPadding * 2 - tilePadding * 2) / column;

  useEffect(() => {
    (async () => {
      await Analytics.logEvent("game_view", {
        name: "game_start",
        screen: "GAME",
        purpose: "GAME_START",
      });
    })();
  }, []);
  const setGameInit = async () => {
    stores.game.setImageAndShuffle();
    const stage = await stores.game.getStage();
    setCounter(stage.time);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Counter counter={counter} />
          <Option navigation={navigation} />
        </View>
      ),
    });

    if (isStart) {
      setIsStart(false);
      setGameInit();
      async function getStorage() {
        const level = await stores.game.getLevel();
        setGameLevel(level);
        navigation.setOptions({
          title: `LEVEL ${level}`,
        });
      }
      getStorage();

      setTimeout(() => {
        stores.game.setActiveClose();
      }, 3000);
    }

    const timer =
      counter > 0 &&
      setInterval(() => {
        console.log(adTime);
        setCounter(counter - 1);
        setTime(time + 1);
        setAdTime(adTime + 2);
      }, 1000);

    setCurrentTimer(timer);

    if (!isStart && counter === 0) {
      doGameOver();
      setTimeout(() => {
        setGameOverModalButtonVisible(true);
      }, 2000);
    }

    return () => clearInterval(timer);
  }, [navigation, counter]);

  const doSelect = async (key, item) => {
    if (isClick || item.active) {
      return;
    }
    if (prevItems.key === null) {
      setPrevNumber({
        key: key,
        number: item.number,
      });
      stores.game.setActive(key, true);
      return;
    }

    if (prevItems.number === item.number) {
      stores.game.setActive(key, true);
    } else {
      setIsClick(true);
      stores.game.setActive(key, true);

      if (stores.game.isVibration) {
        Vibration.vibrate();
      }

      setTimeout(() => {
        stores.game.setActive(prevItems.key, false);
        stores.game.setActive(key, false);
        setIsClick(false);
      }, 200);
    }
    setPrevNumber({
      key: null,
      number: null,
    });

    if (stores.game.isClear()) {
      const level = await stores.game.getLevel();
      stores.game.setLevel(Number(level) + 1);
      setGameClearModalVisible(true);
      stores.game.setScore(gameLevel, time);
      clearInterval(currentTimer);
      setTimeout(() => {
        setGameClearModalButtonVisible(true);
      }, 2000);
    }
  };

  const doNext = () => {
    if (adTime > 20) {
      setAdTime(0);
      (async () => {
        const res = await Interstitial();
        res.addEventListener("interstitialDidClose", () => {
          setGameInit();
          setIsStart(true);
          setGameClearModalButtonVisible(false);
          setGameClearModalVisible(false);
        });
      })();
    } else {
      setGameInit();
      setIsStart(true);
      setGameClearModalButtonVisible(false);
      setGameClearModalVisible(false);
    }
  };

  const doRestart = () => {
    if (adTime > 20) {
      setAdTime(0);
      (async () => {
        const res = await Interstitial();
        res.addEventListener("interstitialDidClose", () => {
          setGameInit();
          setGameOverModalVisible(false);
          setIsStart(true);
        });
        res.removeAllListeners();
      })();
    } else {
      setGameInit();
      setGameOverModalVisible(false);
      setIsStart(true);
    }
  };

  const doGameOver = () => {
    setGameOverModalVisible(true);
  };

  return (
    <ContainerWrap source={BackImage}>
      <Container>
        {items.map((item, key) => {
          return (
            <Tile
              style={{ height: tileHeight, width: tileWidthPercent }}
              key={item.id}
            >
              <InnerTile onPress={() => doSelect(key, item)}>
                <TileImage
                  source={item.image}
                  style={item.active ? { opacity: 1 } : { opacity: 0 }}
                ></TileImage>
              </InnerTile>
            </Tile>
          );
        })}
      </Container>
      <Banner />
      <RNModal
        isVisible={gameClearModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Congratulation />
        <RNModalView>
          <Congratulation />
          <RNModalTitle>LEVEL {gameLevel} CLEAR</RNModalTitle>
          <RNModalAdmob>
            <Banner bannerSize="mediumRectangle" />
          </RNModalAdmob>
          {gameClearModalButtonVisible ? (
            <RNModalButtonWrap>
              <RNModalNextButton onPress={() => doNext()}>
                <RNModalNextButtonText>NEXT</RNModalNextButtonText>
              </RNModalNextButton>
            </RNModalButtonWrap>
          ) : null}
        </RNModalView>
      </RNModal>

      <RNModal
        isVisible={gameOverModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <RNModalView>
          <RNModalTitle>Game Over</RNModalTitle>
          <RNModalDescription>Would you like to try again?</RNModalDescription>
          <RNModalAdmob>
            <Banner bannerSize="mediumRectangle" />
          </RNModalAdmob>
          {gameOverModalButtonVisible ? (
            <RNModalButtonWrap>
              <RNModalNextButtonLeft
                onPress={() => setGameOverModalVisible(false)}
              >
                <RNModalNextButtonText>No</RNModalNextButtonText>
              </RNModalNextButtonLeft>
              <RNModalNextButtonRight onPress={() => doRestart()}>
                <RNModalNextButtonText>Okay</RNModalNextButtonText>
              </RNModalNextButtonRight>
            </RNModalButtonWrap>
          ) : null}
        </RNModalView>
      </RNModal>
    </ContainerWrap>
  );
});
