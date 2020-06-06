import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";
import { Circle } from "react-native-svg";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import AwesomeAlert from "react-native-awesome-alerts";
import { NavigationEvents } from "react-navigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Header,
  Text,
  Button,
  ThemeContext,
  Card,
} from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SymptomsDetailScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
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
    setData(navigation.state.params.data);
  }, [navigation.state.params.data]);

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
  return (
    <>
      <NavigationEvents
        onWillFocus={() => {
          // setError(false);
          setData(navigation.state.params.data);
          // console.log("Nav Evenet");
        }}
      />
      {data === null ? null : (
        <ScrollView style={{ marginHorizontal: wp("2%") }}>
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
              text: "Symptoms Details",
              style: { color: "black", fontFamily: "helvari-bold" },
            }}
            rightComponent={
              <MaterialCommunityIcons
                name="keyboard-backspace"
                color={"black"}
                size={30}
                onPress={() => {
                  navigation.navigate("SymptomsMain");
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
            Disease Probability Graph
          </Text>
          {/* console.log("i am called") */}
          <BarChart
            data={data}
            width={wp("100%")}
            height={hp("50%")}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
          />
          {data.datasets[0].data.map((item, i) => {
            return (
              <Card
                title={data.labels[i]}
                key={i}
                style={{ justifyContent: "center" }}
              >
                <AnimatedCircularProgress
                  size={120}
                  width={15}
                  fill={item}
                  tintColor="#e26a00"
                  backgroundColor="#3d5875"
                  padding={10}
                  style={{ marginHorizontal: wp("20%") }}
                  renderCap={({ center }) => (
                    <Circle cx={center.x} cy={center.y} r="10" fill="blue" />
                  )}
                >
                  {(fill) => <Text>{parseInt(item).toString() + " %"}</Text>}
                </AnimatedCircularProgress>
                <Text>
                  There is {Math.round(item)}% Chance of {data.labels[i]}{" "}
                  disease. Kindly Contact your Concerned Docter
                </Text>
              </Card>
            );
          })}
        </ScrollView>
      )}
      <View style={{ flex: 1 }}>
        <AwesomeAlert
          show={data === null}
          showProgress={true}
          title="Error fetching symptoms Details"
          message="Go Back To Symptoms Screen"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          // showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Symptoms Screen"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            console.log("Cancel");
          }}
          onConfirmPressed={() => {
            console.log("Symptoms Details Go Back Home Screen");
            navigation.navigate("SymptomsMain");
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
});

export default SymptomsDetailScreen;
