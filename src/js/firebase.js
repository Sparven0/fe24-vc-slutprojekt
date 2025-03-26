import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCrb29tiI36LydSoblcr9jTUbEC9UU4eg4",
  authDomain: "version-control-6ffc4.firebaseapp.com",
  databaseURL:
    "https://version-control-6ffc4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "version-control-6ffc4",
  storageBucket: "version-control-6ffc4.firebasestorage.app",
  messagingSenderId: "966076434873",
  appId: "1:966076434873:web:e333fed8f4d4e80dd18e68",
};

const app = initializeApp(firebaseConfig);
//This is a database
export const database = getDatabase(app);