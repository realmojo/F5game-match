import React from "react";
import { View, Button, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components/native";
import { Banner } from "../../lib";
import BackImage from "../../assets/background.png";

const RNModalAdmob = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: -40px;
  margin-bottom: 40px;
`;

const ContainerWrap = styled.ImageBackground`
  flex: 1;
  resize-mode: cover;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 10px;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
`;

export const HomeScreen = ({ navigation }) => {
  return (
    <>
      <ContainerWrap source={BackImage}>
        <Container>
          <Text
            style={{
              fontSize: 34,
              color: "white",
              fontWeight: "bold",
              marginBottom: 40,
            }}
          >
            Picture Match
          </Text>
          <RNModalAdmob>
            <Banner bannerSize="mediumRectangle" />
          </RNModalAdmob>
          <View style={{ width: 100, marginTop: 40 }}>
            <Button
              style={{ width: 100 }}
              title="PLAY"
              onPress={() => navigation.push("Game")}
            />
          </View>
          <StatusBar hidden={true} />
        </Container>
      </ContainerWrap>
    </>
  );
};
