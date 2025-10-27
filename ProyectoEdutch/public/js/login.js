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

    console.log("🟢 Intentando iniciar sesión con:", email);

    // 📧 Validar correo institucional
    if (!email.endsWith("@ucvvirtual.edu.pe")) {
      alert("⚠️ Usa tu correo institucional @ucvvirtual.edu.pe");
      return;
    }

    try {
      // 🔐 Autenticar usuario con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Usuario autenticado:", user.uid);

      // 📘 Buscar datos en Firestore
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("⚠️ No se encontraron datos del usuario en la base de datos.");
        return;
      }

      const datos = docSnap.data();
      console.log("📂 Datos obtenidos desde Firestore:", datos);

      // 💾 Guardar en localStorage
      localStorage.setItem("usuario", JSON.stringify(datos));

      // 🚀 Redirigir según el rol
      const rol = (datos.rol || "").toLowerCase().trim();
      console.log("🎭 Rol detectado:", rol);

      if (rol === "tutor") {
        console.log("➡️ Redirigiendo a /principal_tutor");
        window.location.href = "/principal_tutor";
      } 
      else if (rol === "tutorado") {
        console.log("➡️ Redirigiendo a /principal_alumno");
        window.location.href = "/principal_alumno";
      } 
      else {
        console.log("⚠️ Rol desconocido:", rol);
        alert("El usuario no tiene un rol válido (debe ser tutor o tutorado).");
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error.code, error.message);

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          alert("Correo o contraseña incorrectos.");
          break;
        case "auth/user-not-found":
          alert("Usuario no encontrado. Verifica tu correo.");
          break;
        default:
          alert(`Error: ${error.message}`);
          break;
      }
    }
  });
});
