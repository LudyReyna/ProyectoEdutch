// --- Importamos Firebase y Firestore ---
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Elementos del DOM ---
const listaContactos = document.getElementById("listaContactos");
const nombreChat = document.getElementById("nombreChat");
const mensajes = document.getElementById("mensajes");
const formMensaje = document.getElementById("formMensaje");
const inputMensaje = document.getElementById("mensajeInput");
const logoutBtn = document.getElementById("logoutBtn");

let chatActual = "chat1"; // ID por defecto del chat activo
let unsubscribe = null; // para detener el listener anterior

// --- Cambiar de conversación ---
listaContactos.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    document.querySelectorAll("#listaContactos li").forEach(li => li.classList.remove("activo"));
    e.target.classList.add("activo");

    chatActual = e.target.dataset.id;
    nombreChat.textContent = e.target.dataset.nombre;

    if (unsubscribe) unsubscribe(); // Detener escucha del chat anterior
    cargarMensajes(chatActual);
  }
});

// --- Cargar mensajes en tiempo real ---
function cargarMensajes(chatId) {
  mensajes.innerHTML = "<p class='info'>Cargando mensajes...</p>";

  const q = query(collection(db, "chats", chatId, "mensajes"), orderBy("timestamp", "asc"));

  unsubscribe = onSnapshot(q, (snapshot) => {
    mensajes.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      agregarMensaje(data.tipo, data.texto, data.timestamp);
    });
    mensajes.scrollTop = mensajes.scrollHeight;
  });
}

// --- Enviar mensaje ---
formMensaje.addEventListener("submit", async (e) => {
  e.preventDefault();
  const texto = inputMensaje.value.trim();
  if (!texto) return;

  await addDoc(collection(db, "chats", chatActual, "mensajes"), {
    texto,
    tipo: "enviado",
    timestamp: serverTimestamp()
  });

  inputMensaje.value = "";
});

// --- Mostrar mensaje ---
function agregarMensaje(tipo, texto, timestamp) {
  const div = document.createElement("div");
  div.classList.add("mensaje", tipo);
  const hora = timestamp?.toDate
    ? timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  div.innerHTML = `
    <p>${texto}</p>
    <span class="hora">${hora}</span>
  `;
  mensajes.appendChild(div);
}

// --- Logout ---
logoutBtn.addEventListener("click", () => {
  if (confirm("¿Deseas cerrar sesión?")) {
    window.location.href = "../login.html";
  }
});

// Cargar el chat inicial al abrir la página
cargarMensajes(chatActual);

