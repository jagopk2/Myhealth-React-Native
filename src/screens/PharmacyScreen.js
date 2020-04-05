import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  Card,
  Header,
  Button,
  Text,
  ThemeContext,
  Image
} from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
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
      "helvari-medium-italic": require("../../assets/fonts/helvarimediumitalic.ttf")
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
    "Rahim Yar Khan",
    "Gojra",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Mardan",
    "Gujrat"
  ];

  const Images = [
    "https://www.parhlo.com/wp-content/uploads/2016/12/PicMonkey-Collage-36.jpg",
    "https://www.thenews.com.pk/assets/uploads/updates/2019-11-02/l_549798_084044_updates.jpg",
    "https://3.bp.blogspot.com/-qMq0F1xsQw0/VE3U6hJ9YtI/AAAAAAAABP8/H5o_OAS726g/s1600/Medical_College_Road_Dera_Ghazi_Khan-722431.jpg",
    "https://i2.wp.com/content.pk/wp-content/uploads/2018/01/Gujranwala-to-Gujar-Khan-Train-Timings-Fares-Duration-Contact.jpg?resize=780%2C470&ssl=1",
    "https://i.ytimg.com/vi/9FltBnORyro/hqdefault.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dc/Chaman_City.jpg",
    "https://www.pakpedia.pk/files/Image/jpg/full/c76647b00b21407a8cfecbf3ad729a58.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Shrine_of_RAJAN_SHAH_Layyah.JPG/220px-Shrine_of_RAJAN_SHAH_Layyah.JPG",
    "https://3.bp.blogspot.com/-ltkqN2ZdH5c/ToiK2kNyE9I/AAAAAAAAAt4/TTlMZxHfHko/s1600/1468131101_a4fc1f1349_b.jpg",
    "https://pakistanistories.com/wp-content/uploads/2018/10/PP-118-Toba-Tek-Singh-by-election-2018-780x405.png",
    "https://lh3.googleusercontent.com/proxy/-xNecrg_6O90xBQIObnKl4EQ6Yi4fxscDhPdIYh6nz3dfKvNofvfazEWY1pziA5sDtS1HiSEX93vhshKuF3g5sA_h6DHJFtquZa_5xNVtQfcGsjb5TVJmvkIdg",
    "https://www.pakpedia.pk/files/Image/jpg/full/552561bc6c1ac0b85505c00652bfb255.jpg",
    "https://www.toppakistan.com/wp-content/uploads/2016/05/5-14.jpg",
    "https://i.ytimg.com/vi/QNMZlI8gVgk/maxresdefault.jpg",
    "https://i.pinimg.com/originals/46/99/09/469909f5373fa3a86c46adaaa00dca5a.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Guides_Memmorial.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Eid_Gah_Gujrat.jpg"
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
          style: { color: "black", fontFamily: "helvari-bold" }
        }}
        rightComponent={
          <MaterialCommunityIcons
            name="home"
            color={"black"}
            size={30}
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
        }
        containerStyle={{
          backgroundColor: theme.colorNav,
          justifyContent: "space-around",
          paddingTop: 0,
          height: hp("10%")
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
              city: item
            });
          }}
        >
          <ImageOverlay
            source={{ uri: Images[i] }}
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
    backgroundColor: "white"
  },
  cityImage: {
    height: hp("15%"),
    width: wp("30%"),
    marginHorizontal: hp("1%")
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
    justifyContent: "space-between"
  },
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%")
  }
});

export default PharmacyScreen;
