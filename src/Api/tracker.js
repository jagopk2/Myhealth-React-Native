import axios from "axios";
import { AsyncStorage } from "react-native";
const instance = axios.create({
  // baseURL: "http://13.58.97.218:3000",
  baseURL: "http://a23465714e43.ngrok.io",
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  () => {
    return Promise.reject(err);
  }
);

export default instance;
