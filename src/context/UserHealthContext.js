import createDataContext from "./createDataContext";
import trackerApi from "../Api/tracker";
import { AsyncStorage } from "react-native";
import { navigate } from "../navigationRef";

const UserHealthReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "set_noData":
      return { ...state, noData: action.payload };
    case "fetch_tracks":
      return {
        ...state,
        records: action.payload,
        errorMessage: "",
        noData: false,
      };
    case "no_tracks":
      return { ...state };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "clear_success_message":
      return { ...state, successMessage: "" };
    case "add_record":
      return {
        ...state,
        errorMessage: "",
        successMessage: "Record Added Succesfully",
        noData: false,
      };
    default:
      return state;
  }
};

const fetchTracks = (dispatch) => async (type, showMessage) => {
  //console.log("I am called");
  const userId = await AsyncStorage.getItem("userId");
  console.log(type);
  try {
    switch (type) {
      case "blood_pressure":
        response = await trackerApi.get(`/getBloodPressure?id=${userId}`, {
          userId,
        });
        if (response.data === "noData") {
          show_info_message(
            showMessage,
            "Kindly Enter Readings to View Records"
          );
          dispatch({ type: "set_noData", payload: true });
        } else {
          show_success_message(showMessage, "Record Fetched Succesfully");
          dispatch({ type: "fetch_tracks", payload: response.data });
        }
        break;

      case "heart_rate":
        response = await trackerApi.get(`/getHeartRate?id=${userId}`, {
          userId,
        });
        if (response.data === "noData") {
          show_info_message(
            showMessage,
            "Kindly Enter Readings to View Records"
          );
          dispatch({ type: "set_noData", payload: true });
        } else {
          show_success_message(showMessage, "Record Fetched Succesfully");
          dispatch({ type: "fetch_tracks", payload: response.data });
        }
        break;
      case "random_plasma_sugar":
        response = await trackerApi.get(
          `/getRandomPlasmaGlucose?id=${userId}`,
          {
            userId,
          }
        );
        if (response.data === "noData") {
          show_info_message(
            showMessage,
            "Kindly Enter Readings to View Records"
          );
          dispatch({ type: "set_noData", payload: true });
        } else {
          show_success_message(showMessage, "Record Fetched Succesfully");
          dispatch({ type: "fetch_tracks", payload: response.data });
        }
        break;
      case "fasting_plasma_sugar":
        response = await trackerApi.get(
          `/getFastingPlasmaGlucose?id=${userId}`,
          {
            userId,
          }
        );
        if (response.data === "noData") {
          show_info_message(
            showMessage,
            "Kindly Enter Readings to View Records"
          );
          dispatch({ type: "set_noData", payload: true });
        } else {
          show_success_message(showMessage, "Record Fetched Succesfully");
          dispatch({ type: "fetch_tracks", payload: response.data });
        }
        break;

      default:
        response: null;
        //show_error_message(showMessage, "Cannot Fetch Records");
        dispatch({ type: "fetch_tracks", payload: [] });
        break;
    }
  } catch (error) {
    console.log("user1", error);
    show_error_message(showMessage, "Cannot Fetch Records");

    dispatch({
      type: "add_error",
      payload: "Something went wrong with User Health",
    });
  }

  // console.log(response.data);
};
const addRecord = (dispatch) => async ({ reading, type, showMessage }) => {
  const userId = await AsyncStorage.getItem("userId");

  try {
    switch (type) {
      case "blood_pressure":
        response = await trackerApi.post("/savebloodpressure/", {
          bpReport: {
            value: reading,
            user_id: userId,
          },
        });
        dispatch({ type: "add_record" });
        show_success_message(showMessage, "Record Added Succesfully");
        navigate("ShowReading");
        break;
      case "heart_rate":
        response = await trackerApi.post("/saveheart/", {
          heartReport: {
            value: reading,
            user_id: userId,
          },
        });
        dispatch({ type: "add_record" });
        show_success_message(showMessage, "Record Added Succesfully");
        navigate("ShowReading");
        break;
      case "random_plasma_sugar":
        response = await trackerApi.post("/saveglucose/", {
          diabeticReport: {
            value: reading,
            user_id: userId,
          },
        });
        dispatch({ type: "add_record" });
        show_success_message(showMessage, "Record Added Succesfully");
        //
        navigate("ShowReading");
        break;
      case "fasting_plasma_sugar":
        response = await trackerApi.post("/savefastinplasamglucose/", {
          diabeticReport: {
            value: reading,
            user_id: userId,
          },
        });
        dispatch({ type: "add_record" });
        show_success_message(showMessage, "Record Added Succesfully");
        navigate("ShowReading");
        break;
      default:
        response: null;
        dispatch({ type: "fetch_tracks", payload: [] });
        break;
    }
  } catch (error) {
    console.log("user1", error);
    show_error_message(showMessage, "Cannot Add New Records");
    dispatch({
      type: "add_error",
      payload: "Something went wrong with User Health",
    });
  }
  // console.log(error.message)
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};
const clearSuccessMessage = (dispatch) => () => {
  dispatch({ type: "clear_success_message" });
};
const set_noData = (dispatch) => (value) => {
  dispatch({ type: "set_noData", payload: value });
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
  UserHealthReducer,
  { addRecord, fetchTracks, clearErrorMessage, clearSuccessMessage },
  { records: [], errorMessage: "", successMessage: "", noData: false }
);
