import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = 'civic_token'; // Matches your storage logic perfectly

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

client.interceptors.request.use(
  async (config) => {
    try {
      // Look up the correct key string
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      
      console.log('--- AXIOS DEBUG ---');
      console.log('Token read from SecureStore:', token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Sending Auth Header:', config.headers.Authorization);
      } else {
        console.log('WARNING: No token found in SecureStore! Header is empty.');
      }
      console.log('-------------------');
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