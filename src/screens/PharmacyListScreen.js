import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import trackerApi from "../Api/tracker";
// import Toast from "react-native-simple-toast";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { showMessage, hideMessage } from "react-native-flash-message";
import ProgressLoader from "rn-progress-loader";
import {
  Header,
  Text,
  Button,
  ThemeContext,
  ListItem,
} from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const PharmacyList = ({ navigation }) => {
  const [city, setCity] = useState(null);
  const [cityList, setCityList] = useState([]);
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
    setCity(navigation.state.params.city);
    fetchPharmacies(navigation.state.params.city, setCityList);
  }, [navigation.state.params.city]);

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
          text: `Pharmacy List`,
          style: { color: "black", fontFamily: "helvari-bold" },
        }}
        rightComponent={
          <MaterialCommunityIcons
            name="keyboard-backspace"
            color={"black"}
            size={30}
            onPress={() => {
              navigation.navigate("PharmacyMain");
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
      <Text h3 style={styles.mainHeading}>
        Welcome to {city} Pharmacies
      </Text>
      {cityList.length
        ? cityList.map((item, i) => {
            {
              /* console.log(item.position[0]); */
            }

            return item.status === "Verified" ? (
              <ListItem
                roundAvatar
                leftAvatar={
                  <MaterialCommunityIcons
                    name="pharmacy"
                    color="red"
                    size={30}
                  />
                }
                rightAvatar={
                  <MaterialIcons name="verified-user" color="green" size={30} />
                }
                key={item.name}
                title={item.name}
                subtitle={item.adress}
              />
            ) : (
              <ListItem
                roundAvatar
                leftAvatar={
                  <MaterialCommunityIcons
                    name="pharmacy"
                    color="red"
                    size={30}
                  />
                }
                key={item.name}
                title={item.name}
                subtitle={item.adress}
              />
            );
          })
        : null}
    </ScrollView>
  );
};

const fetchPharmacies = async (city, setCityList) => {
  console.log(city.toString());
  try {
    const response = await trackerApi.get(
      `/getPharmacies?city=${city.toString()}`
    );

    // console.log(response.data);
    setCityList(response.data);
    showMessage({
      message: "Pharmacies Fetched Succesfully",
      icon: "auto",
      type: "success",
      duration: 2500,
    });
  } catch (error) {
    console.log("Error Fetching Pharmacies", error);
    showMessage({
      message: "Pharmacies cannot be Fetched Succesfully",
      icon: "auto",
      type: "danger",
      duration: 2500,
    });
    // Toast.show("Error Fetching Pharmacies");
  }
};

const styles = StyleSheet.create({
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
});

export default PharmacyList;
