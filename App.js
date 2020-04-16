import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { ScrollView } from "react-native-gesture-handler";
import FlashMessage from "react-native-flash-message";

import AccountScreen from "./src/screens/AccountScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuth";
import UserReportsScreen from "./src/screens/UserReportsScreen";
import DoctorsScreen from "./src/screens/DoctorsScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as UserHealthProvider } from "./src/context/UserHealthContext";
import { Provider as ImageProvider } from "./src/context/ImageContext";
import { setNavigator } from "./src/navigationRef";
import { ThemeProvider, Button, Header } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//a
import MyDrawer from "./src/components/MyDrawer";
import HomepageScreen from "./src/screens/HomepageScreen";
import UserHealthScreen from "./src/screens/UserHealthScreen";
import SymptomsScreen from "./src/screens/SymptomsScreen";
import ShowReadingScreen from "./src/screens/ShowReadingScreen";
import EnterReadingScreen from "./src/screens/EnterReadingScreen";
import CameraReadingScreen from "./src/screens/CameraReadingScreen";
import Pharmacy from "./src/screens/PharmacyScreen";
import PharmacyListScreen from "./src/screens/PharmacyListScreen";
import PharmacyScreen from "./src/screens/PharmacyScreen";
import SymptomsDetailScreen from "./src/screens/SymptomsDetailScreen";
import { lightTheme } from "./src/themes/light";

const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  loginFlow: createStackNavigator({
    Signup: SignupScreen,
    Signin: SigninScreen,
  }),
  mainFlow: createDrawerNavigator(
    {
      Homepage: HomepageScreen,
      UserHealth: createStackNavigator(
        {
          UserHealthMain: UserHealthScreen,
          UserHealthFlow: createBottomTabNavigator({
            ShowReading: ShowReadingScreen,
            EnterReading: EnterReadingScreen,
            CameraReading: CameraReadingScreen,
          }),
        },
        {
          headerMode: "none",
          navigationOptions: {
            title: "User Health",
            drawerIcon: ({ tintColor }) => (
              <MaterialCommunityIcons
                name="heart"
                color={tintColor}
                size={25}
              />
            ),
          },
        }
      ),
      Pharmacy: createStackNavigator(
        {
          PharmacyMain: PharmacyScreen,
          PharmacyList: PharmacyListScreen,
        },
        {
          headerMode: "none",
          navigationOptions: {
            title: "Pharmacies",
            drawerIcon: ({ tintColor }) => (
              <MaterialCommunityIcons
                name="pharmacy"
                color={tintColor}
                size={25}
              />
            ),
          },
        }
      ),
      Symptoms: createStackNavigator(
        {
          SymptomsMain: SymptomsScreen,
          SymptomsDetail: SymptomsDetailScreen,
        },
        {
          headerMode: "none",
          navigationOptions: {
            title: "Symptoms Prediction",
            drawerIcon: ({ tintColor }) => (
              <MaterialCommunityIcons
                name="bullseye-arrow"
                color={tintColor}
                size={25}
              />
            ),
          },
        }
      ),

      Doctors: DoctorsScreen,
      UserReports: UserReportsScreen,
      Account: AccountScreen,
    },
    {
      initialRouteName: "Homepage",
      contentComponent: MyDrawer,
      drawerOpenRoute: "DrawerOpen",
      drawerCloseRoute: "DrawerClose",
      drawerToggleRoute: "DrawerToggle",
      // contentComponent: CustomDrawerComponent
    }
  ),
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <ImageProvider>
        <UserHealthProvider>
          <AuthProvider>
            <App
              ref={(navigator) => {
                setNavigator(navigator);
              }}
            />
            <FlashMessage position="top" animated={true} />
          </AuthProvider>
        </UserHealthProvider>
      </ImageProvider>
    </ThemeProvider>
  );
};
