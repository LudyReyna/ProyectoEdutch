// =======================================================
// 📋 PANEL DEL TUTOR - Solicitudes Recibidas
// =======================================================

import { db } from "../firebase/firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { crearChat } from "./crearChat.js"; // 🧩 Importamos la función limpia

console.log("✅ registro_tutor.js cargado correctamente");

document.addEventListener("DOMContentLoaded", async () => {
  const tablaBody = document.querySelector("#tablaSolicitudes tbody");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    alert("⚠️ Debes iniciar sesión como tutor para acceder a tus solicitudes.");
    window.location.href = "/login.html";
    return;
  }

  if (usuario.rol !== "tutor") {
    alert("⚠️ Solo los tutores pueden acceder a esta sección.");
    return;
  }

  try {
    // 🔍 Obtener todas las solicitudes asignadas a este tutor
    const q = query(collection(db, "solicitudes"), where("tutorEmail", "==", usuario.email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      tablaBody.innerHTML = `<tr><td colspan="7">📭 No tienes solicitudes por el momento.</td></tr>`;
      return;
    }

    let filas = "";
    snapshot.forEach((docSnap) => {
      const solicitud = docSnap.data();

      filas += `
        <tr>
          <td>${solicitud.tutoradoEmail}</td>
          <td>${solicitud.cursoSolicitado}</td>
          <td>${solicitud.modalidadSolicitada}</td>
          <td>${solicitud.diasSolicitados}</td>
          <td>${solicitud.horarioSolicitado}</td>
          <td>${solicitud.estado}</td>
          <td>
            ${
              solicitud.estado === "pendiente"
                ? `
                <button class="btn-aceptar"
                  data-id="${docSnap.id}"
                  data-email="${solicitud.tutoradoEmail}"
                  data-curso="${solicitud.cursoSolicitado}"
                  data-nombretutorado="${solicitud.nombreTutorado || "Sin nombre"}"
                >✅ Aceptar</button>
                <button class="btn-rechazar" data-id="${docSnap.id}">❌ Rechazar</button>`
                : `<span class="estado-${solicitud.estado}">${solicitud.estado.toUpperCase()}</span>`
            }
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = filas;
  } catch (error) {
    console.error("❌ Error al cargar solicitudes:", error);
    tablaBody.innerHTML = `<tr><td colspan="7">⚠️ Error al cargar las solicitudes.</td></tr>`;
  }
});

// =======================================================
// 🔄 Aceptar o Rechazar Solicitud
// =======================================================
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-aceptar") || e.target.classList.contains("btn-rechazar")) {
    const id = e.target.getAttribute("data-id");
    const nuevoEstado = e.target.classList.contains("btn-aceptar") ? "aceptada" : "rechazada";

    try {
      // 🕒 Actualizamos el estado de la solicitud
      await updateDoc(doc(db, "solicitudes", id), {
        estado: nuevoEstado,
        fechaActualizacion: serverTimestamp(),
      });

      // ✅ Si se acepta, creamos el chat automáticamente
      if (nuevoEstado === "aceptada") {
        const tutoradoEmail = e.target.getAttribute("data-email");
        const curso = e.target.getAttribute("data-curso");
        const nombreTutorado = e.target.getAttribute("data-nombretutorado") || "Sin nombre";
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        // 🧩 Llamada al creador limpio del chat
        await crearChat({
          tutorEmail: usuario.email,
          nombreTutor: usuario.nombre || "Tutor sin nombre",
          tutoradoEmail: tutoradoEmail,
          nombreTutorado: nombreTutorado,
          curso: curso,
          dias: "No especificado",
          horario: "No especificado",
        });

        alert("✅ Solicitud aceptada y chat creado correctamente.");
      } else {
        alert("❌ Solicitud rechazada.");
      }

      location.reload();
    } catch (error) {
      console.error("❌ Error al actualizar solicitud:", error);
      alert("⚠️ No se pudo actualizar el estado de la solicitud.");
    }
  }
});

