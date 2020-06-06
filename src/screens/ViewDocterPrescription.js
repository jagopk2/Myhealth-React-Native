import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Spacer from "../components/Spacer";
import { Context as ImageContext } from "../context/ImageContext";
import Swiper from "react-native-realistic-deck-swiper";
import { DeckSwiper, Card, CardItem, Left, Body, Icon } from "native-base";
import { NavigationEvents } from "react-navigation";
import { showMessage, hideMessage } from "react-native-flash-message";
import ProgressLoader from "rn-progress-loader";
import { Header, Text, Button, ThemeContext } from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ImageView from "react-native-image-view";
const ViewDocterPrescriptionScreen = ({ navigation }) => {
  const {
    fetchPrescription,
    clearErrorMessage,
    state: { images, errorMessage, noData },
  } = useContext(ImageContext);
  const { theme } = useContext(ThemeContext);
  const [fontLoad, setFontLoad] = useState(false);
  const [viewImage, setViewImage] = useState(null);
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
    fetchPrescription(showMessage);
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
  if (noData) {
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
            text: "User Reports",
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
        <Text style={styles.mainHeading} h3>
          No Reports Found
        </Text>
      </View>
    );
  }
  return (
    <ScrollView style={theme.container}>
      <NavigationEvents
        onWillFocus={() => {
          fetchPrescription(showMessage);
          //clearErrorMessage();
        }}
      />
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
          text: "Docter Prescription",
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
        {" "}
        Swipe to View Doctor Prescription
      </Text>
      {images.length ? (
        <View style={{ height: hp("100%"), marginHorizontal: wp("2%") }}>
          <View>
            <DeckSwiper
              dataSource={images}
              renderItem={(image) => (
                <Card style={{ elevation: 3 }}>
                  <CardItem>
                    <Left>
                      <Icon name="heart" style={{ color: "#ED4A6A" }} />
                      {/* <Thumbnail source={item.image} /> */}
                      <Body>
                        <Text>Docter Prescription</Text>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody>
                    <TouchableOpacity
                      style={{ height: wp("70%"), flex: 1 }}
                      onPress={() => {
                        setViewImage(image);
                      }}
                    >
                      <Image
                        style={{ height: wp("70%"), flex: 1 }}
                        source={{ uri: `data:image/gif;base64,${image.img}` }}
                      />
                    </TouchableOpacity>
                  </CardItem>
                </Card>
              )}
            />
          </View>
        </View>
      ) : null}
      {viewImage === null ? null : (
        <ImageView
          images={[
            {
              source: { uri: `data:image/gif;base64,${viewImage.img}` },
              title:
                viewImage.reportName.charAt(0).toUpperCase() +
                viewImage.reportName.slice(1).split("_").join(" "),
              width: wp("90%"),
              height: hp("90%"),
            },
          ]}
          imageIndex={0}
          isVisible={!(viewImage === null)}
          onClose={() => {
            setViewImage(null);
          }}
        />
      )}

      <ProgressLoader
        visible={!(images.length > 0)}
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
ViewDocterPrescriptionScreen.navigationOptions = (screenProps) => ({
  title: "Medical Reports",
  drawerIcon: ({ tintColor }) => (
    <MaterialCommunityIcons name="book-outline" color={tintColor} size={27} />
  ),
});
const styles = StyleSheet.create({
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
});

export default ViewDocterPrescriptionScreen;