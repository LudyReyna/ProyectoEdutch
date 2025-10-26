// 🔥 Importamos Firebase desde tu carpeta firebase/
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "../firebase/firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Validar correo institucional
    if (!email.endsWith("@ucvvirtual.edu.pe")) {
      alert("Error: Usa tu correo institucional @ucvvirtual.edu.pe");
      return;
    }

    try {
      // Autenticar usuario con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener datos del usuario desde Firestore
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const datos = docSnap.data();
        console.log("Datos del usuario:", datos);

        // Guardar sesión local (para mostrar luego en perfil)
        localStorage.setItem("usuario", JSON.stringify(datos));

        // Redirigir según el rol
        if (datos.rol === "tutor") {
          window.location.href = "principal_tutor.html";
        } else {
          window.location.href = "principal_alumno.html";
        }
      } else {
        alert("No se encontraron datos del usuario en la base de datos.");
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error.code, error.message);

      if (error.code === "auth/invalid-credential") {
        alert("Correo o contraseña incorrectos.");
      } else if (error.code === "auth/user-not-found") {
        alert("Usuario no encontrado. Verifica tu correo.");
      } else if (error.code === "auth/wrong-password") {
        alert("Contraseña incorrecta.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  });
});