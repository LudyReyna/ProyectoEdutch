// ✅ Importamos Firebase
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "../firebase/firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const nombreEl = document.getElementById("nombre");
  const rolEl = document.querySelector(".rol");
  const logoutBtn = document.getElementById("logoutBtn");
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");

  // Obtener usuario desde localStorage
  const usuarioJSON = localStorage.getItem("usuario");
  if (!usuarioJSON) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "login.html";
    return;
  }

  const usuario = JSON.parse(usuarioJSON);

  // Mostrar datos actuales
  nombreEl.textContent = usuario.nombre;
  rolEl.textContent = usuario.rol === "tutor" ? "Tutor" : "Alumno";

  // --- 🧩 MODO EDICIÓN ---
  editBtn.addEventListener("click", () => {
    // Cambiar elementos de texto por inputs editables
    const nombreInput = document.createElement("input");
    nombreInput.type = "text";
    nombreInput.value = usuario.nombre;
    nombreInput.id = "nombreEditable";
    nombreInput.classList.add("editable-input");

    nombreEl.replaceWith(nombreInput);

    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
  });

  // --- 💾 GUARDAR CAMBIOS ---
  saveBtn.addEventListener("click", async () => {
    const nuevoNombre = document.getElementById("nombreEditable").value.trim();

    if (!nuevoNombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    try {
      // Actualizar Firestore
      const userDoc = doc(db, "usuarios", usuario.uid);
      await updateDoc(userDoc, { nombre: nuevoNombre });

      // Actualizar localStorage
      usuario.nombre = nuevoNombre;
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Volver a mostrar como texto
      const nuevoNombreEl = document.createElement("h2");
      nuevoNombreEl.id = "nombre";
      nuevoNombreEl.textContent = nuevoNombre;

      document.getElementById("nombreEditable").replaceWith(nuevoNombreEl);

      editBtn.classList.remove("hidden");
      saveBtn.classList.add("hidden");

      alert("✅ Cambios guardados correctamente.");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Error al guardar los cambios.");
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
});