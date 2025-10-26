// IMPORTAMOS DESDE LAS URLs DEL NAVEGADOR (CDN)
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ IMPORT CORREGIDO: usamos '../' para subir una carpeta y entrar a backend/
import { auth, db } from "../firebase/firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;

    // Validaciones
    if (!email.endsWith("@ucvvirtual.edu.pe")) {
      alert("Error: Usa tu correo institucional @ucvvirtual.edu.pe");
      return;
    }
    if (password.length < 6) {
      alert("Error: La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (!rol) {
      alert("Error: Selecciona si eres Tutor o Alumno");
      return;
    }

    // Lógica de Firebase
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: nombre,
        email: email,
        rol: rol,
        fechaRegistro: new Date()
      });

      alert(`Registro exitoso ✅ ¡Bienvenido/a ${nombre}!`);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error al registrar:", error.code, error.message);
      if (error.code === "auth/email-already-in-use") {
        alert("Error: El correo electrónico ya está registrado.");
      } else if (error.code === "auth/weak-password") {
        alert("Error: La contraseña es demasiado débil.");
      } else {
        alert(`Error al registrar usuario: ${error.message}`);
      }
    }
  });
});
