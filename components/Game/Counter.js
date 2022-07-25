import React from "react";
import styled from "styled-components/native";
import { convertTime } from "../../lib";

const CouterText = styled.Text`
  padding-right: 10px;
  padding-top: 14px;
  font-size: 20px;
`;

export const Counter = ({ counter }) => {
  return (
    <>
      <CouterText>{convertTime(counter)}</CouterText>
    </>
  );
};
