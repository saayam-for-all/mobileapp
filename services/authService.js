import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "idToken";

export const setToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = async () => AsyncStorage.getItem(TOKEN_KEY);

export const clearToken = async () => AsyncStorage.removeItem(TOKEN_KEY);
