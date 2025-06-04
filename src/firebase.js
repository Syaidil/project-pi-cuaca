// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPH0NJ6f-hIvGcR5wSurlO8ZPnEWbZj5I",
  authDomain: "cuacaapp-idil.firebaseapp.com",
  databaseURL: "https://cuacaapp-idil-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cuacaapp-idil",
  storageBucket: "cuacaapp-idil.firebasestorage.app",
  messagingSenderId: "73384699556",
  appId: "1:73384699556:web:7973dd1b3fbe6d0124e831",
  measurementId: "G-NC06X5BZTD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

export { database };
