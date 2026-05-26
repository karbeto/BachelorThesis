import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = 'civic_token';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

client.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('WARNING: No token found in SecureStore! Header is empty.');
      }
    } catch (error) {
      console.error('Failed to fetch auth token from SecureStore:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;