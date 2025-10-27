// ===============================================
// 🔥 REGISTRO DE USUARIOS EDU MATCH (Mejorado sin alertas)
// ===============================================

// Importar Firebase
import { auth, db } from "../firebase/firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Confirmar carga
console.log("✅ registro.js cargado correctamente");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const rol = document.getElementById("rol");
  const tutorFields = document.getElementById("tutorFields");
  const tutoradoFields = document.getElementById("tutoradoFields");
  const mensajeStatus = document.getElementById("mensajeStatus");

  // 🧩 Mostrar campos según el rol
  rol.addEventListener("change", () => {
    tutorFields.classList.toggle("hidden", rol.value !== "tutor");
    tutoradoFields.classList.toggle("hidden", rol.value !== "tutorado");
  });

  // 📨 Función para mostrar mensajes
  const mostrarMensaje = (texto, tipo = "info") => {
    mensajeStatus.textContent = texto;
    mensajeStatus.className = `mensaje ${tipo}`;
    mensajeStatus.style.display = "block";
  };

  // 🚀 Registro
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mostrarMensaje("Registrando usuario...", "info");

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const edad = document.getElementById("edad").value.trim();
    const carrera = document.getElementById("carrera").value.trim();
    const rolSeleccionado = rol.value;

    if (!email.endsWith("@ucvvirtual.edu.pe")) {
      mostrarMensaje("⚠️ Usa tu correo institucional @ucvvirtual.edu.pe", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const datosBase = {
        uid: user.uid,
        nombre,
        email,
        edad,
        carrera,
        rol: rolSeleccionado,
        creadoEn: new Date().toISOString(),
      };

      let datosExtra = {};

      if (rolSeleccionado === "tutor") {
        datosExtra = {
          curso: document.getElementById("cursoTutor").value.trim(),
          nivel: document.getElementById("nivelTutor").value,
          dias: document.getElementById("diasTutor").value,
          horario: document.getElementById("horaTutor").value,
          modalidad: document.getElementById("modalidadTutor").value,
          tipoEnsenanza: document.getElementById("tipoEnsenanzaTutor").value,
          metodo: document.getElementById("metodoTutor").value.trim(),
          experiencia: document.getElementById("experiencia").value.trim(),
          objetivo: document.getElementById("objetivoTutor").value.trim(),
        };
      } else if (rolSeleccionado === "tutorado") {
        datosExtra = {
          cursosInteres: document.getElementById("cursosInteres").value.trim(),
          nivelActual: document.getElementById("nivelTutorado").value,
          tipoAprendizaje: document.getElementById("tipoAprendizaje").value,
          dias: document.getElementById("diasTutorado").value,
          horario: document.getElementById("horaTutorado").value,
          modalidad: document.getElementById("modalidadTutorado").value,
          objetivo: document.getElementById("objetivoTutorado").value.trim(),
        };
      }

      await setDoc(doc(db, "usuarios", user.uid), { ...datosBase, ...datosExtra });

      mostrarMensaje("✅ Registro exitoso. Redirigiendo al inicio de sesión...", "success");

      setTimeout(() => {
        window.location.href = "/login.html";
      }, 2500);

    } catch (error) {
      console.error("❌ Error en el registro:", error.code, error.message);

      let mensaje = "❌ Ocurrió un error. Inténtalo nuevamente.";
      if (error.code === "auth/email-already-in-use") mensaje = "⚠️ Este correo ya está registrado.";
      else if (error.code === "auth/invalid-email") mensaje = "⚠️ Correo no válido.";
      else if (error.code === "auth/weak-password") mensaje = "⚠️ La contraseña debe tener al menos 6 caracteres.";

      mostrarMensaje(mensaje, "error");
    }
  });
});


