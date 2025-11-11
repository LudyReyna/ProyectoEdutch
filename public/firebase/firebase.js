// IMPORTAMOS DESDE LAS URLs DEL NAVEGADOR (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCs8j9rjA5cyO2sRvjv1A7tizHxif7SMg0",
  authDomain: "edumatch-42577.firebaseapp.com",
  projectId: "edumatch-42577",
  storageBucket: "edumatch-42577.appspot.com",
  messagingSenderId: "216464197953",
  appId: "1:216464197953:web:4a21566351913dcbde39c0",
  measurementId: "G-M71PVSHWHW"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Exportamos los servicios
export { app, analytics, auth, db };


