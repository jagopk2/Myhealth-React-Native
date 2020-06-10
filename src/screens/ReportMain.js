import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Header, Text, Button, ThemeContext } from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { SliderBox } from "react-native-image-slider-box";
const slider_images = [
  require("../../assets/slider/1.jpg"),
  require("../../assets/slider/2.jpg"),
  require("../../assets/slider/3.jpg"),
  require("../../assets/slider/4.jpg"),
  require("../../assets/slider/5.jpg"),
  require("../../assets/slider/6.jpg"),
];
const ReportMainScreen = ({ navigation }) => {
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
    <ScrollView style={theme.container}>
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
          text: "User Health",
          style: { color: "black", fontFamily: "helvari-bold" },
        }}
        rightComponent={
          <MaterialCommunityIcons
            name="home"
            color={"black"}
            size={30}
            onPress={() => {
              navigation.navigate("Homepage");
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
      <View style={styles.mainHeading}>
        <Text style={{ textAlign: "center" }} h4>
          Welcome to the Medical Reports Screen
        </Text>
      </View>

      <View style={styles.mainItemsContainer}>
        <Text style={styles.mainItemsHeading} h4>
          Manage Reports
        </Text>
        <View style={styles.mainItems}>
          <TouchableOpacity
            style={styles.customCard}
            onPress={() => {
              navigation.navigate("AddReport");
            }}
          >
            <Text style={styles.mainItemsText}>Upload </Text>
            <Text style={styles.mainItemsText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.customCard}
            onPress={() => {
              navigation.navigate("ViewReport");
            }}
          >
            <Text style={styles.mainItemsText}>View</Text>
            <Text style={styles.mainItemsText}>Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

ReportMainScreen.navigationOptions = (screenProps) => ({
  title: "Home Screen",
  drawerIcon: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="home"
      color={tintColor}
      size={27}
      onPress={() => {
        navigation.toggleDrawer();
      }}
    />
  ),
  // ,
  // header: props => (
  //   console.log(props),
  //   (
  //     <Header
  //       placement="left"
  //       leftComponent={
  //         <MaterialCommunityIcons
  //           name="menu"
  //           color={"white"}
  //           size={30}
  //           onPress={() => {
  //             navigation.toggleDrawer();
  //           }}
  //         />
  //       }
  //       centerComponent={{ text: "MY TITLE", style: { color: "#fff" } }}
  //       rightComponent={{ icon: "home", color: "#fff" }}
  //     />
  //   )
  // )
});
const styles = StyleSheet.create({
  slider: {
    height: hp("40%"),
  },
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  customCard: {
    height: hp("20%"),
    backgroundColor: "#5e7ff6",
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp("7%"),

    marginTop: hp("5%"),
    width: wp("35%"),
  },

  mainItemsContainer: {
    height: hp("65%"),
    width: wp("90%"),
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    backgroundColor: "#f1f4f9",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: hp("5%"),
  },
  mainItemsHeading: {
    marginTop: hp("5%"),
    textAlign: "center",
    color: "#2d343e",
  },
  mainItems: {
    display: "flex",
    flexDirection: "row",
  },
  mainItemsText: {
    marginTop: hp("1%"),
    textAlign: "center",
    fontFamily: "helvari-bold",
    color: "white",
    fontSize: 18,
  },
});

export default ReportMainScreen;
