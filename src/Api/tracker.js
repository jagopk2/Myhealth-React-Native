import axios from "axios";
import { AsyncStorage } from "react-native";
const instance = axios.create({
  baseURL: "http://9c0567b1.ngrok.io",
  // baseURL: "http://7a216134.ngrok.ioa"
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
