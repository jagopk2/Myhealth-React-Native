import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Header,
  Text,
  Button,
  ThemeContext,
  Avatar,
} from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AsyncStorage } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";

const AccountScreen = ({ navigation }) => {
  const { signout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [fontLoad, setFontLoad] = useState(false);
  const [user, setUser] = useState(null);

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
  const get_user = async (setUser) => {
    var user = await AsyncStorage.getItem("user");
    user = JSON.parse(user);
    setUser(user);
    return user;
  };
  useEffect(() => {
    get_user(setUser);
  }, []);

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

  return user === null ? null : (
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
          text: "Account",
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
      <Text h2 style={styles.mainHeading}>
        Account Screen
      </Text>
      <Grid style={{ marginHorizontal: wp("5%") }}>
        <Row
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={require("../../assets/userIcon.jpg")}
            containerStyle={{
              height: wp("50%"),
              width: wp("50%"),
            }}
          />
        </Row>
        <Row style={{ marginVertical: hp("4%") }}>
          <Col size={1}>
            <Text h4>Name:</Text>
          </Col>
          <Col size={3}>
            <Text h4>{user.Name}</Text>
          </Col>
        </Row>
        <Row style={{ marginVertical: hp("4%") }}>
          <Col size={1}>
            <Text h4>Email:</Text>
          </Col>
          <Col size={3}>
            <Text h4>{user.Email}</Text>
          </Col>
        </Row>
        <Row style={{ marginVertical: hp("4%") }}>
          <Col size={2}>
            <Text h4>Phone Number:</Text>
          </Col>
          <Col size={3}>
            <Text h4>{user.Phone_Number}</Text>
          </Col>
        </Row>
      </Grid>
      <Spacer>
        <Button title="SignOut" onPress={signout} />
      </Spacer>
    </ScrollView>
  );
};
AccountScreen.navigationOptions = (screenProps) => ({
  title: "Account",
  drawerIcon: ({ tintColor }) => (
    <MaterialCommunityIcons
      name="account-circle-outline"
      color={tintColor}
      size={27}
      onPress={() => {
        navigation.toggleDrawer();
      }}
    />
  ),
});

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

export default AccountScreen;
