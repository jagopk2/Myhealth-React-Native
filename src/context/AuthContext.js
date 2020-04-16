import createDataContext from "./createDataContext";
import trackerApi from "../Api/tracker";
import { AsyncStorage } from "react-native";
import { navigate } from "../navigationRef";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signup":
      return { ...state, token: action.payload, errorMessage: "" };
    case "signin":
      return { ...state, token: action.payload, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    default:
      return state;
  }
};

const signup = (dispatch) => async ({
  email,
  password,
  name,
  phoneNumber,
  showMessage,
}) => {
  console.log("phone", phoneNumber);
  console.log("name", name);
  try {
    const response = await trackerApi.post("/register", {
      email,
      encrypted_password: password,
      Name: name,
      phoneNumber,
    });
    show_success_message(showMessage, "Succesfully Signed Up..! Kindly Login");
    // await AsyncStorage.setItem("token", response.data.token);
    // await AsyncStorage.setItem("userId", response.data.userId);
    // await AsyncStorage.setItem("user", response.data.user);

    dispatch({ type: "signup", payload: response.data.token });
    navigate("Signin");
    // console.log(response.data)
  } catch (error) {
    show_error_message(showMessage, "Error While Signing Up..!");

    dispatch({
      type: "add_error",
      payload: "Something went wrong with Sign up",
    });
    // console.log(error.message)
  }
};
const signin = (dispatch) => async ({ email, password, showMessage }) => {
  try {
    const response = await trackerApi.post("/login", {
      email,
      password,
    });
    // console.log(response.data.userId);
    await AsyncStorage.setItem("token", response.data.token);
    await AsyncStorage.setItem("userId", response.data.userId);
    await AsyncStorage.setItem("user", response.data.user);
    getPushNotificationPermissions(response.data.userId);
    show_success_message(showMessage, "Succesfully Signed In..!");

    dispatch({ type: "signin", payload: response.data.token });
    navigate("mainFlow");
  } catch (error) {
    show_error_message(showMessage, "Error While Signing In..!");
    dispatch({
      type: "add_error",
      payload: "Something went wrong with Sign in",
    });
    // console.log(error.message)
  }
};
const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};
const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  const id = await AsyncStorage.getItem("userId");
  if (token) {
    getPushNotificationPermissions(id);
    dispatch({ type: "signin", payload: token });
    navigate("mainFlow");
  } else {
    navigate("loginFlow");
  }
};
const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("userId");
  await AsyncStorage.removeItem("user");

  dispatch({ type: "signout" });
  navigate("Signin");
};

const show_success_message = (showMessage, message) => {
  showMessage({
    message,
    icon: "auto",
    type: "success",
    duration: 2500,
  });
};
const show_error_message = (showMessage, message) => {
  showMessage({
    message,
    icon: "auto",
    type: "danger",
    duration: 2500,
  });
};

const getPushNotificationPermissions = async (id) => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    console.log("noGranted");
    return;
  }
  // console.log(finalStatus);

  // // Get the token that uniquely identifies this device
  // console.log(
  //   "Notification Token: ",
  //   await Notifications.getExpoPushTokenAsync()
  // );
  if (Platform.OS === "android") {
    Notifications.createChannelAndroidAsync("healthApp-messages", {
      name: "Health App messages",
      sound: true,
    });
  }
  try {
    const response = await trackerApi.post("/savenotification", {
      id,
      token: await Notifications.getExpoPushTokenAsync(),
    });
  } catch (error) {
    console.log("notification Error", error);
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signup, signout, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
