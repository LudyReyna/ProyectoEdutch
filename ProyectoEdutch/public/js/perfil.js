// ✅ Importamos Firebase
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "../firebase/firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const nombreEl = document.getElementById("nombre");
  const rolEl = document.querySelector(".rol");
  const logoutBtn = document.getElementById("logoutBtn");
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");

  // Referencias a campos académicos
  const carreraText = document.getElementById("carrera-text");
  const cursoText = document.getElementById("curso-text");
  const nivelText = document.getElementById("nivel-text");
  const disponibilidadText = document.getElementById("disponibilidad-text");

  const carreraInput = document.getElementById("carrera-input");
  const cursoInput = document.getElementById("curso-input");
  const nivelInput = document.getElementById("nivel-input");
  const disponibilidadInput = document.getElementById("disponibilidad-input");

  // 🧠 Obtener usuario desde localStorage
  const usuarioJSON = localStorage.getItem("usuario");
  if (!usuarioJSON) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "login.html";
    return;
  }

  const usuario = JSON.parse(usuarioJSON);

  // 🔥 Mostrar datos actuales
  nombreEl.textContent = usuario.nombre;
  rolEl.textContent = usuario.rol === "tutor" ? "Tutor" : "Alumno";

  // Cargar más datos desde Firestore (por si hay cambios recientes)
  try {
    const userRef = doc(db, "usuarios", usuario.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      carreraText.textContent = data.carrera || "Sin especificar";
      cursoText.textContent = data.curso || "Sin especificar";
      nivelText.textContent = data.nivel || "Sin especificar";
      disponibilidadText.textContent = data.horario || "No definido";
    }
  } catch (error) {
    console.error("Error al cargar datos de Firestore:", error);
  }

  // --- ✏️ MODO EDICIÓN ---
  editBtn.addEventListener("click", () => {
    toggleEdicion(true);
  });

  // --- 💾 GUARDAR CAMBIOS ---
  saveBtn.addEventListener("click", async () => {
    const nuevoNombre = document.getElementById("nombreEditable").value.trim();
    const nuevosDatos = {
      nombre: nuevoNombre || usuario.nombre,
      carrera: carreraInput.value.trim() || carreraText.textContent,
      curso: cursoInput.value.trim() || cursoText.textContent,
      nivel: nivelInput.value || nivelText.textContent,
      horario: disponibilidadInput.value.trim() || disponibilidadText.textContent
    };

    try {
      const userRef = doc(db, "usuarios", usuario.uid);
      await updateDoc(userRef, nuevosDatos);

      // Actualizar interfaz
      nombreEl.textContent = nuevosDatos.nombre;
      carreraText.textContent = nuevosDatos.carrera;
      cursoText.textContent = nuevosDatos.curso;
      nivelText.textContent = nuevosDatos.nivel;
      disponibilidadText.textContent = nuevosDatos.horario;

      // Actualizar localStorage
      usuario.nombre = nuevosDatos.nombre;
      localStorage.setItem("usuario", JSON.stringify(usuario));

      toggleEdicion(false);
      alert("✅ Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("❌ Ocurrió un error al actualizar el perfil.");
    }
  });

  // --- 🚪 CERRAR SESIÓN ---
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("usuario");
      alert("Sesión cerrada correctamente.");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Inténtalo nuevamente.");
    }
  });

  // 🔁 Alternar entre modo vista y edición
  function toggleEdicion(modoEdicion) {
    const mostrar = modoEdicion ? "inline-block" : "none";
    const ocultar = modoEdicion ? "none" : "inline-block";

    editBtn.style.display = ocultar;
    saveBtn.style.display = mostrar;

    // Nombre
    if (modoEdicion) {
      const nombreInput = document.createElement("input");
      nombreInput.type = "text";
      nombreInput.value = nombreEl.textContent;
      nombreInput.id = "nombreEditable";
      nombreInput.classList.add("editable-input");
      nombreEl.replaceWith(nombreInput);
    } else {
      const nuevoNombreEl = document.createElement("h2");
      nuevoNombreEl.id = "nombre";
      nuevoNombreEl.textContent = nombreEl.textContent;
      document.getElementById("nombreEditable")?.replaceWith(nuevoNombreEl);
    }

    // Mostrar/ocultar campos académicos
    [carreraText, cursoText, nivelText, disponibilidadText].forEach((el) => el.classList.toggle("hidden"));
    [carreraInput, cursoInput, nivelInput, disponibilidadInput].forEach((el) => el.classList.toggle("hidden"));

    if (modoEdicion) {
      carreraInput.value = carreraText.textContent;
      cursoInput.value = cursoText.textContent;
      nivelInput.value = nivelText.textContent;
      disponibilidadInput.value = disponibilidadText.textContent;
    }
  }
});