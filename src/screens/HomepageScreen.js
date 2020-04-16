import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import {
  Text,
  Header,
  Button,
  ThemeContext,
  Card,
  Icon,
} from "react-native-elements";
import trackerApi from "../Api/tracker";
import { AsyncStorage } from "react-native";
import AnimatedSplash from "react-native-animated-splash-screen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { SliderBox } from "react-native-image-slider-box";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Col, Row, Grid } from "react-native-easy-grid";
import { AppLoading } from "expo";
import { setCustomText } from "react-native-global-props";
import * as Font from "expo-font";
// import LottieView from "lottie-react-native";
const slider_images = [
  "https://source.unsplash.com/1024x768/?nature",
  "https://source.unsplash.com/1024x768/?water",
  "https://source.unsplash.com/1024x768/?boy",
  "https://source.unsplash.com/1024x768/?tree",
];
const get_user = async (setUser) => {
  var user = await AsyncStorage.getItem("user");
  user = JSON.parse(user);
  setUser(user);
  return user;
};
const HomepageScreen = ({ navigation }) => {
  const [firstLoad, setFirstLoad] = useState(false);
  const [user, setUser] = useState(null);
  const [fontLoad, setFontLoad] = useState(false);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    setTimeout(() => {
      setFirstLoad(!firstLoad);
    }, 2000);
  }, []);
  useEffect(() => {
    get_user(setUser);
  }, []);
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
          setCustomText({
            style: {
              fontSize: 14,
              fontFamily: "helvari-regular",
              color: "black",
            },
          });
        }}
      />
    );
  }
  return (
    <AnimatedSplash
      isLoaded={firstLoad}
      logoImage={require("../../assets/heartbeat.png")}
      backgroundColor={"#fffafa"}
      logoHeight={100}
      logoWidht={100}
    >
      {user !== null ? (
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
              text: "Home",
              style: { color: "black", fontFamily: "helvari-bold" },
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
              height: hp("10%"),
            }}
          />
          {/* <SliderBox
            sliderBoxHeight={styles.slider.height}
            images={slider_images}
            circleLoop
            autoplay
          /> */}
          <View style={styles.mainHeading}>
            <Text h4>Hi {user.Name}!</Text>
            <Text h4>Let's Take Care of you!</Text>
          </View>

          <View style={styles.shortcuts}>
            <Grid>
              <Row>
                <TouchableOpacity
                  style={styles.shortcutItem}
                  onPress={() => {
                    navigation.navigate("UserHealthFlow", {
                      type: "random_plasma_sugar",
                    });
                  }}
                >
                  <MaterialCommunityIcons
                    name="book-outline"
                    color={"white"}
                    size={20}
                  />
                  <Text style={styles.shortcutItemText}>
                    Daily Sugar Readings
                  </Text>
                </TouchableOpacity>
              </Row>
              <Row>
                <TouchableOpacity
                  style={styles.shortcutItem}
                  onPress={() => {
                    navigation.navigate("Symptoms");
                  }}
                >
                  <Feather name="user-x" color={"white"} size={20} />
                  <Text style={styles.shortcutItemText}>
                    Feeling Sick ? Tell us !
                  </Text>
                </TouchableOpacity>
              </Row>
              <Row>
                <TouchableOpacity
                  style={styles.shortcutItem}
                  onPress={() => {
                    navigation.navigate("Doctors");
                  }}
                >
                  <MaterialCommunityIcons
                    name="hospital"
                    color={"white"}
                    size={20}
                  />
                  <Text style={styles.shortcutItemText}>Find Hospitals</Text>
                </TouchableOpacity>
              </Row>
            </Grid>
          </View>
          <View style={styles.mainItemsContainer}>
            <Text style={styles.mainItemsHeading} h4>
              What are you Looking for ?
            </Text>
            <View style={styles.mainItems}>
              <TouchableOpacity
                style={styles.customCard}
                onPress={() => {
                  navigation.navigate("UserHealthMain");
                }}
              >
                <MaterialCommunityIcons
                  name="heart-pulse"
                  color={"black"}
                  size={40}
                />
                <Text style={styles.mainItemsText}>Health</Text>
                <Text style={styles.mainItemsText}>Platform</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.customCard}
                onPress={() => {
                  navigation.navigate("Symptoms");
                }}
              >
                <MaterialCommunityIcons
                  name="bullseye-arrow"
                  color={"black"}
                  size={40}
                />
                <Text style={styles.mainItemsText}>Disease</Text>
                <Text style={styles.mainItemsText}>Prediction</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mainItems}>
              <TouchableOpacity
                style={styles.customCard}
                onPress={() => {
                  navigation.navigate("UserReports");
                }}
              >
                <Feather name="book" color={"black"} size={40} />
                <Text style={styles.mainItemsText}>Medical</Text>
                <Text style={styles.mainItemsText}>Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.customCard}
                onPress={() => {
                  navigation.navigate("Doctors");
                }}
              >
                <FontAwesome5 name="hospital" color={"black"} size={40} />
                <Text style={styles.mainItemsText}>Nearby</Text>
                <Text style={styles.mainItemsText}>Hospitals</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mainItems}>
              <TouchableOpacity
                style={styles.customCard}
                onPress={() => {
                  navigation.navigate("Pharmacy");
                }}
              >
                <MaterialCommunityIcons
                  name="pharmacy"
                  color={"black"}
                  size={40}
                />
                <Text style={styles.mainItemsText}>Nearby</Text>
                <Text style={styles.mainItemsText}>Pharmacies</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.customCard}
                onPress={() => {
                  navigation.navigate("Account");
                }}
              >
                <Feather name="user" color={"black"} size={40} />
                <Text style={styles.mainItemsText}>Account</Text>
                <Text style={styles.mainItemsText}>Information</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <Text>Fetching User Please Wait</Text>
        </View>
      )}
    </AnimatedSplash>
  );
};

// HomepageScreen.navigationOptions = screenProps => ({
//   title: screenProps.navigation.getParam("MY PAge")
// });
HomepageScreen.navigationOptions = (screenProps) => ({
  title: "Home Screen",
  drawerIcon: ({ tintColor }) => (
    <MaterialCommunityIcons name="home" color={tintColor} size={27} />
  ),
});
const styles = StyleSheet.create({
  slider: {
    height: hp("40%"),
  },
  cardItems: {
    height: hp("10%"),
  },
  customCard: {
    height: hp("20%"),
    backgroundColor: "#E3E8F2",
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp("7%"),

    marginTop: hp("5%"),
    width: wp("35%"),
  },
  mainHeading: {
    marginTop: hp("10%"),
    marginLeft: wp("15%"),
  },
  shortcuts: {
    marginTop: hp("5%"),
  },
  shortcutItem: {
    display: "flex",
    flexDirection: "row",
    padding: hp("3%"),
    backgroundColor: "#4c71f5",
    marginLeft: wp("15%"),
    width: wp("85%"),
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    marginBottom: hp("2%"),
  },
  shortcutItemText: {
    color: "white",
    marginLeft: 10,
    marginTop: 1,
  },

  mainItemsContainer: {
    height: hp("87%"),
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
    color: "#2d343e",
    marginLeft: wp("8%"),
  },
  mainItems: {
    display: "flex",
    flexDirection: "row",
  },
  mainItemsText: {
    marginTop: hp("1%"),
    fontFamily: "helvari-bold",
  },
});

export default HomepageScreen;
