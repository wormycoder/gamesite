import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQ_DSUJEU3Q5a6lx1pinVOz4aN1yHSFfc",
  authDomain: "game-domain.firebaseapp.com",
  databaseURL: "https://game-domain-default-rtdb.firebaseio.com",
  projectId: "game-domain",
  storageBucket: "game-domain.firebasestorage.app",
  messagingSenderId: "877446218577",
  appId: "1:877446218577:web:45060721ce6e683627c970",
  measurementId: "G-DBJTCM2VH0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);