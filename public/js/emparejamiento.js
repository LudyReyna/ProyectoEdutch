// =========================================================
// 🤖 Emparejamiento IA + Tutor Real desde Firestore
// =========================================================

import { db } from "../firebase/firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("✅ Emparejamiento IA cargado");

const form = document.getElementById("formMatch");
const resultadoIA = document.getElementById("resultadoIA");
const progress = document.getElementById("progress");
const statusText = document.getElementById("status");
const matchInfo = document.getElementById("matchInfo");

let tutorSugerido = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener valores del formulario
  const curso = document.getElementById("curso").value.trim();
  const nivel = document.getElementById("nivel").value;
  const dias = document.getElementById("dias").value;
  const horario = document.getElementById("hora").value;
  const modalidad = document.getElementById("modalidad").value;
  const tipoAprendizaje = document.getElementById("tipoAprendizaje").value;

  if (!curso || !nivel || !dias || !horario || !modalidad) {
    alert("⚠️ Completa todos los campos para continuar.");
    return;
  }

  // Mostrar animación de análisis
  resultadoIA.classList.remove("hidden");
  matchInfo.classList.add("hidden");
  progress.style.width = "0%";
  statusText.textContent = "🔍 Analizando coincidencias con IA...";

  let progreso = 0;
  const interval = setInterval(() => {
    progreso += 10;
    progress.style.width = progreso + "%";
    if (progreso >= 100) clearInterval(interval);
  }, 150);

  try {
    // Simular llamada a IA (tu backend actual)
    const res = await fetch("/api/ia/emparejamiento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curso, nivel, dias, horario, modalidad, tipoAprendizaje }),
    });

    const data = await res.json();
    clearInterval(interval);

    // 🔍 Buscar en Firestore al tutor real
    const q = query(
      collection(db, "usuarios"),
      where("rol", "==", "tutor"),
      where("curso", "==", curso),
      where("nivel", "==", nivel),
      where("modalidad", "==", modalidad)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      statusText.textContent = "⚠️ No se encontró un tutor disponible con esos criterios.";
      return;
    }

    // Tomar el primer tutor compatible
    const tutor = snapshot.docs[0].data();
    tutorSugerido = {
      nombre: tutor.nombre,
      curso: tutor.curso,
      nivel: tutor.nivel,
      modalidad: tutor.modalidad,
      email: tutor.email,
      dias: tutor.dias,
      horario: tutor.horario,
    };

    // Mostrar datos reales del tutor
    statusText.textContent = "🤖 Resultado del análisis:";
    matchInfo.classList.remove("hidden");
    matchInfo.innerHTML = `
      <div class="card-tutor">
        <h3>🎯 Tutor sugerido</h3>
        <p><b>👩‍🏫 Nombre:</b> ${tutorSugerido.nombre}</p>
        <p><b>📘 Curso:</b> ${tutorSugerido.curso}</p>
        <p><b>📊 Nivel:</b> ${tutorSugerido.nivel}</p>
        <p><b>🏫 Modalidad:</b> ${tutorSugerido.modalidad}</p>
        <p><b>✉️ Contacto:</b> ${tutorSugerido.email}</p>
        <p><b>🗓️ Días:</b> ${tutorSugerido.dias}</p>
        <p><b>🕓 Horario:</b> ${tutorSugerido.horario}</p>
        <button id="btnSolicitar" class="btn-primary">📩 Enviar solicitud de tutoría</button>
      </div>
    `;

  } catch (error) {
    console.error("❌ Error al conectar con la IA o Firestore:", error);
    statusText.textContent = "❌ Error al procesar la solicitud.";
  }
});

// =========================================================
// 📩 Enviar solicitud de tutoría (guardar en Firestore)
// =========================================================

document.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "btnSolicitar") {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      alert("⚠️ Debes iniciar sesión antes de enviar una solicitud.");
      return;
    }

    if (!tutorSugerido) {
      alert("⚠️ No hay tutor sugerido disponible.");
      return;
    }

    try {
      await addDoc(collection(db, "solicitudes"), {
        tutoradoEmail: usuario.email,
        tutorEmail: tutorSugerido.email,
        cursoSolicitado: tutorSugerido.curso,
        nivelSolicitado: tutorSugerido.nivel,
        modalidadSolicitada: tutorSugerido.modalidad,
        diasSolicitados: tutorSugerido.dias,
        horarioSolicitado: tutorSugerido.horario,
        estado: "pendiente",
        fechaSolicitud: serverTimestamp(),
      });

      alert("✅ Solicitud enviada correctamente. Espera la confirmación del tutor.");
      matchInfo.innerHTML += `<p class="success-msg">Solicitud registrada en el sistema ✅</p>`;

    } catch (error) {
      console.error("❌ Error al guardar la solicitud:", error);
      alert("⚠️ Ocurrió un error al enviar la solicitud.");
    }
  }
});


