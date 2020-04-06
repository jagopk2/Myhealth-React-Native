import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { withNavigationFocus } from "react-navigation";
import { Context as ImageContext } from "../context/ImageContext";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import Spacer from "../components/Spacer";
import { AsyncStorage } from "react-native";
// import Toast from "react-native-simple-toast";
import { showMessage, hideMessage } from "react-native-flash-message";
import ProgressLoader from "rn-progress-loader";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  Card,
  Header,
  Button,
  Text,
  ThemeContext,
} from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CameraReadingScreen = ({ navigation }) => {
  const [type, setType] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [camType, setCamType] = useState(Camera.Constants.Type.back);
  const [camRef, setCamRef] = useState(null);
  const [image, setImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(false);
  const { addImage, clearErrorMessage } = useContext(ImageContext);
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
  }, [navigation.state.params.type]);

  useEffect(() => {
    setType(navigation.state.params.type);
  }, [navigation.state.params.type]);

  useEffect(() => {
    (async () => {
      const { status } =
        (await Camera.requestPermissionsAsync()) &&
        (await ImagePicker.requestCameraRollPermissionsAsync());
      setHasPermission(status === "granted");
    })();
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
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const { isFocused } = navigation;
  // console.log(image);
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
      <Text h3 style={styles.mainHeading}>
        Take Picture{" "}
      </Text>
      {isFocused() && (
        <View>
          <Camera
            style={styles.camera}
            type={camType}
            ref={(camera) => {
              setCamRef(camera);
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center",
                }}
                onPress={() => {
                  setCamType(
                    camType === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  {" "}
                  Flip{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )}
      <Spacer />
      <Button
        title="Take Pic"
        onPress={() => {
          takePicture(camRef, setImage, addImage);
        }}
      />
      <Text style={styles.mainHeading} h4>
        {" "}
        OR
      </Text>

      <Button
        title="Pick Image From Gallery"
        onPress={() => {
          // takePicture(camRef);
          pickImage(setImage, addImage);
        }}
        style={styles.buttons}
      />
      {image ? (
        <Card title="Photo Preview">
          <View>
            <Image
              style={styles.image}
              source={{
                uri: image.uri,
              }}
            />
            <Spacer />
            <Button
              title="Upload Photo"
              onPress={async () => {
                let localUri = image.uri;
                let filename = localUri.split("/").pop();

                // Infer the type of the image
                let match = /\.(\w+)$/.exec(filename);
                let imgType = match ? `image/${match[1]}` : `image`;
                const userId = await AsyncStorage.getItem("userId");
                // Upload the image using the fetch and FormData APIs
                let form = new FormData();
                // Assume "photo" is the name of the form field the server expects
                form.append("type", type);
                form.append("id", userId);
                form.append("photo", {
                  uri: localUri,
                  name: filename,
                  type: imgType,
                });
                // addImage(form, Toast, setImage, showMessage, setUploadStatus);
                addImage(form, setImage, showMessage, setUploadStatus);
              }}
            />
          </View>
        </Card>
      ) : null}
      <ProgressLoader
        visible={uploadStatus}
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

const takePicture = async (cameraReference, setImage, addImage) => {
  if (cameraReference) {
    let photo = await cameraReference.takePictureAsync({ quality: 0.3 });
    console.log(photo);

    // pickImage()
    showMessage({
      message: "Image Take Succesfully",
      icon: "auto",
      type: "success",
      duration: 2500,
    });
    setImage(photo);
    // addImage(formData);
  }
};

const pickImage = async (setImage, addImage) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  });

  console.log(result);

  if (!result.cancelled) {
    showMessage({
      message: "Image Picked Succesfully",
      icon: "auto",
      type: "success",
      duration: 2500,
    });
    await setImage(result);
    // addImage(form);
  }
};

const uploadPic = async (photo) => {
  let localUri = photo.uri;
  let filename = localUri.split("/").pop();

  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects
  formData.append("photo", { uri: localUri, name: filename, type });

  return await fetch(YOUR_SERVER_URL, {
    method: "POST",
    body: formData,
    headers: {
      "content-type": "multipart/form-data",
    },
  });
};
CameraReadingScreen.navigationOptions = {
  title: "Add Camera Report",
  tabBarIcon: (
    <MaterialCommunityIcons name="camera" color={"#4c71f5"} size={20} />
  ),
};
const styles = StyleSheet.create({
  camera: {
    height: hp("50%"),
    width: wp("90%"),
    marginHorizontal: wp("5%"),
  },
  image: {
    height: hp("50%"),
    width: "100%",
  },
  buttons: {
    marginTop: hp("5%"),
  },
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
});

export default withNavigationFocus(CameraReadingScreen);
