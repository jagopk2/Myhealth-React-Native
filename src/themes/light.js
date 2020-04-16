import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
const styles = StyleSheet.create({
  background: {
    backgroundColor: "transparent"
  }
});

const lightTheme = {
  Button: {
    type: "clear",
    titleStyle: { color: "white" },
    containerStyle: { backgroundColor: "#4c71f5" },
    fontFamily: "helvari-regular"

    // icon: <Icon name="arrow-right" size={15} color="black" />
  },
  Text: {
    style: {
      fontFamily: "helvari-regular"
    }
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  colorNav: "transparent"
};

export { lightTheme };
