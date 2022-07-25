import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import RNModal from "react-native-modal";

export const ModalTester = () => {
  const [rnmodalVisible, setRNModalVisible] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <RNModal
        isVisible={rnmodalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.rnmodalView}>
          <Text>Modal Title</Text>
          <Text style={{ marginVertical: 10 }}>Modal Description ilpasdf</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setRNModalVisible(false)}
            >
              <Text styles={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setRNModalVisible(false)}
            >
              <Text styles={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  rnmodalView: {
    backgroundColor: "white",
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: "#222f3e",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
