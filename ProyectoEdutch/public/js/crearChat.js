// =======================================================
// 💬 CREAR CHAT LIMPIO - FIRESTORE
// =======================================================
import { db } from "../firebase/firebase.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function crearChat({
  tutorEmail,
  nombreTutor,
  tutoradoEmail,
  nombreTutorado,
  curso,
  dias,
  horario,
}) {
  try {
    // 🔹 Crear un ID único, ordenando correos y limpiando puntos
    const chatId = [tutorEmail, tutoradoEmail].sort().join("_").replace(/\./g, "_");

    // 🔹 Crear documento en la raíz de la colección
    await setDoc(doc(db, "chats", chatId), {
      chatId,
      tutorEmail,
      nombreTutor,
      tutoradoEmail,
      nombreTutorado,
      curso,
      dias,
      horario,
      estado: "aceptado",
      creadoEn: serverTimestamp(),
    });

    console.log("✅ Chat creado correctamente:", chatId);
  } catch (error) {
    console.error("❌ Error creando chat:", error);
  }
}
