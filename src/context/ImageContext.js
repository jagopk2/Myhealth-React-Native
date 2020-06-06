import createDataContext from "./createDataContext";
import trackerApi from "../Api/tracker";
import { AsyncStorage } from "react-native";
import { navigate } from "../navigationRef";

const ImageReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "set_noData":
      return { ...state, noData: action.payload };
    case "fetch_image":
      // console.log(state);
      return { ...state, images: action.payload, noData: false };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "add_image":
      return { ...state, errorMessage: "", noData: false };
    default:
      return state;
  }
};

const fetchImage = (dispatch) => async (showMessage) => {
  //console.log("I am called");
  const userId = await AsyncStorage.getItem("userId");
  try {
    response = await trackerApi.get(`/getReports?id=${userId}`, {
      userId,
    });
    if (response.data === "noData") {
      show_info_message(showMessage, "Kindly Enter Readings to View Records");
      dispatch({ type: "set_noData", payload: true });
    } else {
      show_success_message(showMessage, "Images Fetched Succesfully");

      dispatch({ type: "fetch_image", payload: response.data });
    }
  } catch (error) {
    console.log("user1", error);
    show_error_message(showMessage, "Images Cannot be Fetched");
    dispatch({
      type: "add_error",
      payload: "Something went wrong with User Health",
    });
  }

  // console.log(response.data);
};
const fetchPrescription = (dispatch) => async (showMessage) => {
  //console.log("I am called");
  const userId = await AsyncStorage.getItem("userId");
  try {
    response = await trackerApi.get(`/getPrescriptions?id=${userId}`, {
      userId,
    });
    if (response.data === "noData") {
      show_info_message(
        showMessage,
        "Kindly Add Prescriptions to View Prescriptions"
      );
      dispatch({ type: "set_noData", payload: true });
    } else {
      show_success_message(showMessage, "Images Fetched Succesfully");
      dispatch({ type: "fetch_image", payload: response.data });
    }
  } catch (error) {
    console.log("user1", error);
    show_error_message(showMessage, "Images Cannot be Fetched");
    dispatch({
      type: "add_error",
      payload: "Something went wrong with User Health",
    });
  }

  // console.log(response.data);
};
const addImage = (dispatch) => async (
  formData,
  setImage,
  showMessage,
  setUploadStatus
) => {
  const userId = await AsyncStorage.getItem("userId");
  setUploadStatus(true);
  try {
    response = await trackerApi.post("/uploadImageReport", formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
    // Toast.show("Image Uploaded");
    show_success_message(showMessage, "Image Uploaded Succesfully");

    setImage(null);
    dispatch({ type: "add_image" });
    navigate("UserReports");
  } catch (error) {
    console.log("user1", error);
    // Toast.show("Error Uploading Image");
    show_error_message(showMessage, "Images Cannot be Uploaded");

    dispatch({
      type: "add_error",
      payload: "Something went wrong with User Health",
    });
  }
  setUploadStatus(false);
  // console.log(error.message)
};
const addPrescription = (dispatch) => async (
  formData,
  setImage,
  showMessage,
  setUploadStatus
) => {
  const userId = await AsyncStorage.getItem("userId");
  setUploadStatus(true);
  try {
    response = await trackerApi.post("/uploadPrescription", formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
    // Toast.show("Image Uploaded");
    show_success_message(showMessage, "Image Uploaded Succesfully");

    setImage(null);
    dispatch({ type: "add_image" });
    navigate("ViewPrescription");
  } catch (error) {
    console.log("user1", error);
    // Toast.show("Error Uploading Image");
    show_error_message(showMessage, "Images Cannot be Uploaded");

    dispatch({
      type: "add_error",
      payload: "Something went wrong with User Health",
    });
  }
  setUploadStatus(false);
  // console.log(error.message)
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const show_success_message = (showMessage, message) => {
  showMessage({
    message,
    icon: "auto",
    type: "success",
    duration: 2500,
  });
};
const show_info_message = (showMessage, message) => {
  showMessage({
    message,
    icon: "auto",
    type: "info",
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

export const { Context, Provider } = createDataContext(
  ImageReducer,
  {
    addImage,
    fetchImage,
    clearErrorMessage,
    addPrescription,
    fetchPrescription,
  },
  { images: [], errorMessage: "", noData: false }
);
