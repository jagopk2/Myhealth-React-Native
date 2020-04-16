import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NavigationEvents } from "react-navigation";
import { Context as UserHealthContext } from "../context/UserHealthContext";
import UserHealthForm from "../components/UserHealthForm";

import AwesomeAlert from "react-native-awesome-alerts";
import ProgressLoader from "rn-progress-loader";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Header, Text, Button, ThemeContext } from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const EnterReadingScreen = ({ navigation }) => {
  const [type, setType] = useState(null);
  const {
    state,
    addRecord,
    clearErrorMessage,
    clearSuccessMessage,
    //state: { successMessage, errorMessage }
  } = useContext(UserHealthContext);
  const { theme } = useContext(ThemeContext);
  const [fontLoad, setFontLoad] = useState(false);
  const fetchFonts = () => {
    return Font.loadAsync({
      "helvari-regular": require("../../assets/fonts/helvari.ttf"),
      "helvari-bold": require("../../assets/fonts/helvaribold.ttf"),
      "helvari-italic": require("../../assets/fonts/helvariitalic.ttf"),
      "helvari-italic-bold": require("../../assets/fonts/helvaribolditalic.ttf"),
      "helvari-medium": require("../../assets/fonts/helvarimedium.ttf"),
      "helvari-medium-italic": require("../../assets/fonts/helvarimediumitalic.ttf"),
    });
  };

  useEffect(() => {
    setType(navigation.state.params.type);
  }, [navigation.state.params.type]);
  if (!fontLoad) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoad(true);
        }}
      />
    );
  }
  return (
    <View style={theme.container}>
      <NavigationEvents
        onWillBlur={() => {
          clearErrorMessage();
          clearSuccessMessage();
        }}
      />
      <Header
        placement="left"
        leftComponent={
          <MaterialCommunityIcons
            name="menu"
            color={"black"}
            size={30}
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
        }
        centerComponent={{
          text:
            type.charAt(0).toUpperCase() +
            type.slice(1).split("_").join(" ") +
            " Managment",
          style: { color: "black", fontFamily: "helvari-bold" },
        }}
        rightComponent={
          <MaterialCommunityIcons
            name="keyboard-backspace"
            color={"black"}
            size={30}
            onPress={() => {
              navigation.navigate("UserHealthMain");
            }}
          />
        }
        containerStyle={{
          backgroundColor: theme.colorNav,
          justifyContent: "space-around",
          paddingTop: 0,
          height: hp("10%"),
        }}
      />
      <View style={styles.form}>
        <UserHealthForm
          headerText={
            type.charAt(0).toUpperCase() + type.slice(1).split("_").join(" ")
          }
          errorMessage={state.errorMessage}
          submitButtonText="Add Record"
          onSubmit={addRecord}
          type={type}
        />
      </View>
    </View>
  );
};
EnterReadingScreen.navigationOptions = {
  title: "Add Reading",
  tabBarIcon: (
    <MaterialCommunityIcons name="plus" color={"#4c71f5"} size={20} />
  ),
};
const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  form: {
    marginTop: hp("10%"),
  },
});

export default EnterReadingScreen;
