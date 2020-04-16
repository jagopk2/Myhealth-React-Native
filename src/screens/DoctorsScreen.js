import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import MapView, { Polyline, Circle, Marker } from "react-native-maps";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Location from "expo-location";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
// import Toast from "react-native-simple-toast";
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

import { SliderBox } from "react-native-image-slider-box";
const DoctorsScreen = ({ navigation }) => {
  const [mapRegion, setMapRegion] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationResult, setLocationResult] = useState(null);
  const [doctors, setDoctors] = useState([]);
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
    getLocationAsync();
  }, []);

  const handleMapRegionChange = (mapRegion) => {
    console.log(mapRegion);
    setMapRegion(mapRegion);
  };

  const getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      setLocationResult("Permission to access location was denied");
    } else {
      setLocationPermission(true);
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocationResult(JSON.stringify(location));
    getDoctors(location.coords.latitude, location.coords.longitude);
    // Center the map on the location we just fetched.
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    });
  };

  const getDoctors = async (lat, long) => {
    try {
      const response = await axios.get(
        `https://places.sit.ls.hereapi.com/places/v1/discover/explore?in=${lat}%2C${long}%3Br%3D26293&cat=hospital-health-care-facility&Accept-Language=en-US%2Cen%3Bq%3D0.9&app_id=BZpE1ZafLVLxYrT6Uugz&app_code=0mSN8E_r-FEj3ZfSIiz7AQ`
      );
      // console.log(response);

      const { results } = response.data;
      const { items } = results;
      setDoctors(items);
      showMessage({
        message: "Doctors Fetched Succesfully",
        icon: "auto",
        type: "success",
        duration: 2500,
      });
    } catch (error) {
      showMessage({
        message: "Doctors cannot be Fetched Succesfully",
        icon: "auto",
        type: "danger",
        duration: 2500,
      });
      console.log("cant Fetch Doctors", error);
      // Toast.show("Cannot Fetch Doctors");
    }
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
    <ScrollView style={styles.background}>
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
          text: "Hospitals",
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
      <Text style={styles.mainHeading} h4>
        Near By Hospitals
      </Text>
      {locationResult === null ? (
        <Text>Finding your current location...</Text>
      ) : locationPermission === false ? (
        <Text>Location permissions are not granted.</Text>
      ) : mapRegion === null ? (
        <Text>Map region doesn't exist.</Text>
      ) : (
        <View style={theme.container}>
          <MapView style={styles.mapStyle} region={mapRegion}>
            <Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
            >
              <View style={{ backgroundColor: "transparent", padding: 10 }}>
                <FontAwesome5 name="location-arrow" size={30} />
              </View>
            </Marker>

            {doctors.length
              ? doctors.map((item, i) => {
                  {
                    /* console.log(item.position[0]); */
                  }
                  return (
                    <Marker
                      coordinate={{
                        latitude: item.position[0],
                        longitude: item.position[1],
                      }}
                      key={i}
                      title={item.title}
                    >
                      <View
                        style={{ backgroundColor: "transparent", padding: 10 }}
                      >
                        <MaterialCommunityIcons
                          name="hospital-marker"
                          color="#900"
                          size={30}
                        />
                      </View>
                    </Marker>
                  );
                })
              : null}
          </MapView>
        </View>
      )}
      <Text h4 style={styles.mainHeading}>
        Hospitals List
      </Text>
      {doctors.length
        ? doctors.map((item, i) => {
            {
              /* console.log(item.position[0]); */
            }
            return (
              <ListItem
                roundAvatar
                leftAvatar={
                  <MaterialCommunityIcons
                    name="hospital-building"
                    color="#add8e6"
                    size={30}
                  />
                }
                key={item.id}
                title={item.title}
                subtitle={(item.distance / 1000).toString() + " Km"}
              />
            );
          })
        : null}
      <ProgressLoader
        visible={
          (locationResult === null || mapRegion === null) && locationPermission
        }
        isModal={true}
        isHUD={true}
        hudColor={"#fffafa"}
        color={"#000000"}
        onRequestClose={() => {
          console.log("asdsad");
        }}
      />
    </ScrollView>
  );
};
DoctorsScreen.navigationOptions = (screenProps) => ({
  title: "Hospitals",
  drawerIcon: ({ tintColor }) => (
    <MaterialCommunityIcons name="doctor" color={tintColor} size={27} />
  ),
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: hp("50%"),
  },
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
});

export default DoctorsScreen;

{
  /* <Marker
  coordinate={{
    latitude: mapRegion.latitude,
    longitude: mapRegion.longitude
  }}
>
  <View style={{ backgroundColor: "transparent", padding: 10 }}>
    <MaterialCommunityIcons name="hospital-building" color="#900" size={30} />
  </View>
</Marker>; */
}
