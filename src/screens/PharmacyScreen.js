import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  Card,
  Header,
  Button,
  Text,
  ThemeContext,
  Image,
} from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import ImageOverlay from "react-native-image-overlay";
const PharmacyScreen = ({ navigation }) => {
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

  //  const cities = ["Karachi", "Lahore", "Dera Ghazi Khan", "Gujranwala"];

  const cities = [
    "Karachi",
    "Lahore",
    "Dera Ghazi Khan",
    "Gujranwala",
    "Quetta",
    "Chaman",
    "Khanewal",
    "Layyah",
    "Islamabad",
    "Toba Tek SIngh",
    "Gojra",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Mardan",
    "Gujrat",
    "Rahim Yar Khan",
  ];

  const Images = [
    require("../../assets/cities/pic_000.jpg"),
    require("../../assets/cities/pic_001.jpg"),
    require("../../assets/cities/pic_002.jpg"),
    require("../../assets/cities/pic_003.jpg"),
    require("../../assets/cities/pic_004.jpg"),
    require("../../assets/cities/pic_005.jpg"),
    require("../../assets/cities/pic_006.jpg"),
    require("../../assets/cities/pic_007.jpg"),
    require("../../assets/cities/pic_008.jpg"),
    require("../../assets/cities/pic_009.png"),
    require("../../assets/cities/pic_010.jpg"),
    require("../../assets/cities/pic_011.jpg"),
    require("../../assets/cities/pic_012.jpg"),
    require("../../assets/cities/pic_013.jpg"),
    require("../../assets/cities/pic_014.jpg"),
    require("../../assets/cities/pic_015.jpg"),
    require("../../assets/cities/pic_016.jpeg"),
  ];

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
          text: "Pharmacy Screen",
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
      <Text h4 style={styles.mainHeading}>
        Select your City
      </Text>
      {cities.map((item, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => {
            navigation.navigate("PharmacyList", {
              city: item,
            });
          }}
        >
          <ImageOverlay
            source={Images[i]}
            title={item}
            key={i}
            containerStyle={styles.ImageContainer}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  cityImage: {
    height: hp("15%"),
    width: wp("30%"),
    marginHorizontal: hp("1%"),
  },
  ImageContainer: {
    height: hp("20%"),
    width: wp("90%"),
    marginHorizontal: wp("5%"),
    marginVertical: hp("2%"),
    display: "flex",
    flexDirection: "row",
    borderColor: "#20232a",
    borderRadius: 6,
    justifyContent: "space-between",
  },
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
});

export default PharmacyScreen;
