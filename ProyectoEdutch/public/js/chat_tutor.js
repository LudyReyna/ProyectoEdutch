import { db } from "../firebase/firebase.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  getDocs,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("✅ Chat del tutor cargado correctamente");

const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  alert("⚠️ Debes iniciar sesión para acceder al chat.");
  window.location.href = "/login.html";
}

const mensajesDiv = document.getElementById("mensajes");
const form = document.getElementById("formMensaje");
const inputMensaje = document.getElementById("mensajeInput");
const nombreChat = document.getElementById("nombreChat");
let chatActualId = null;

async function cargarChatsTutor() {
  const lista = document.getElementById("listaContactos");
  lista.innerHTML = "<li>Cargando chats...</li>";

  const q = query(
    collection(db, "chats"),
    where("tutorEmail", "==", usuario.email)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    lista.innerHTML = "<li>No tienes chats activos aún.</li>";
    return;
  }

  lista.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const chat = docSnap.data();
    const li = document.createElement("li");
    li.textContent = `${chat.tutoradoEmail} (${chat.curso})`;
    li.classList.add("item-chat");
    li.onclick = () => iniciarChat(docSnap.id, chat.tutoradoEmail, chat.curso);
    lista.appendChild(li);
  });
}

async function iniciarChat(chatId, tutoradoEmail, curso) {
  chatActualId = chatId;
  nombreChat.textContent = `${tutoradoEmail} (${curso})`;

  const mensajesRef = collection(db, "chats", chatId, "mensajes");
  const q = query(mensajesRef, orderBy("creadoEn", "asc"));

  onSnapshot(q, (snapshot) => {
    mensajesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const mensaje = doc.data();
      const esPropio = mensaje.autor === usuario.email;
      const hora = mensaje.creadoEn?.toDate
        ? mensaje.creadoEn.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";
      const div = document.createElement("div");
      div.classList.add("mensaje", esPropio ? "propio" : "ajeno");
      div.innerHTML = `
        <p>${mensaje.texto}</p>
        <span class="meta">${esPropio ? "Tú" : mensaje.autor.split("@")[0]} • ${hora}</span>
      `;
      mensajesDiv.appendChild(div);
    });
    mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    const texto = inputMensaje.value.trim();
    if (!texto || !chatActualId) return;
    try {
      await addDoc(collection(db, "chats", chatActualId, "mensajes"), {
        texto,
        autor: usuario.email,
        creadoEn: serverTimestamp(),
      });
      inputMensaje.value = "";
    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
    }
  };
}

cargarChatsTutor();


