import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  Header,
  Card,
  Text,
  ListItem,
  Button,
  Icon,
  ThemeContext,
} from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { LineChart } from "react-native-chart-kit";

import { NavigationEvents } from "react-navigation";
import { Context as UserHealthContext } from "../context/UserHealthContext";
import AwesomeAlert from "react-native-awesome-alerts";
import ProgressLoader from "rn-progress-loader";
import { showMessage, hideMessage } from "react-native-flash-message";

const ShowReadingScreen = ({ navigation }) => {
  const [type, setType] = useState(null);

  const {
    state: { records, errorMessage, noData },
    fetchTracks,
    clearErrorMessage,
    reset_UserHealthContext,
  } = useContext(UserHealthContext);
  //console.log(state);
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
    reset_UserHealthContext();
    fetchTracks(navigation.state.params.type, showMessage);
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
  if (noData) {
    console.log(noData);
    return (
      <View>
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
        <Text style={styles.mainHeading} h3>
          No Records Found
        </Text>
      </View>
    );
  }
  return (
    <>
      {/* <Header
        leftComponent={{ icon: "menu", color: "#fff" }}
        centerComponent={{ text: "MY TITLE", style: { color: "#fff" } }}
        rightComponent={{ icon: "home", color: "#fff" }}
      /> */}

      <NavigationEvents
        onWillFocus={() => {
          reset_UserHealthContext();
          fetchTracks(type, showMessage);
          console.log("i should be called");
        }}
      />
      {/* <NavigationEvents onWillBlur={(clearErrorMessage)} /> */}

      {records.length ? (
        <ScrollView>
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

          <Text style={styles.mainHeading} h4>
            {type.charAt(0).toUpperCase() + type.slice(1).split("_").join(" ")}{" "}
            Monthly View
          </Text>
          <LineChart
            data={{
              // labels: ["January", "February", "March", "April", "May", "June"],
              labels: Array.from(
                new Set(
                  records.map((item) => {
                    var date = new Date(item.date);
                    return monthNames[date.getMonth()];
                  })
                )
              ),
              datasets: [
                {
                  data: records.map((item) => parseInt(item.value)),
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={hp("40%")}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={chartConfig}
            bezier
          />
          <Card title="Readings">
            {records.map((item) => {
              return (
                <View key={item.id.toString()}>
                  {/* {console.log()} */}
                  <ListItem
                    title={item.value}
                    bottomDivider
                    leftAvatar={{
                      source: {
                        uri:
                          "https://previews.123rf.com/images/yupiramos/yupiramos1607/yupiramos160701221/59263338-blood-drop-icon-blood-donation-and-transfusion-theme-design-vector-illustration-.jpg",
                      },
                    }}
                    subtitle={new Date(item.date).toDateString()}
                  />
                </View>
              );
            })}
          </Card>
        </ScrollView>
      ) : null}
      <View style={{ flex: 1 }}>
        <AwesomeAlert
          show={errorMessage.length > 0 && !(records.length > 0)}
          showProgress={true}
          title="Error fetching Records"
          message="Go Back To Home Screen"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          // showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Home Screen"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            console.log("Cancel");
          }}
          onConfirmPressed={() => {
            console.log("Symptoms Go Back Home Screen");
            navigation.navigate("Homepage");
            // setError(false);
          }}
        />
        {/* {errorMessage.length > 0 && records.length > 0
          ? showMessage({
              message: "Cannot Feetch New Records",
              icon: "auto",
              type: "danger",
              duration: 2500
            })
          : null} */}
        <ProgressLoader
          visible={!(errorMessage.length > 0) && !(records.length > 0)}
          isModal={true}
          isHUD={true}
          hudColor={"#fffafa"}
          color={"#000000"}
          onRequestClose={() => {
            console.log("asdsad");
          }}
        />
      </View>
    </>
  );
};

ShowReadingScreen.navigationOptions = {
  title: "Show Reading",
  tabBarIcon: <MaterialCommunityIcons name="eye" color={"#4c71f5"} size={20} />,
};
const styles = StyleSheet.create({
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
});

const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default ShowReadingScreen;
