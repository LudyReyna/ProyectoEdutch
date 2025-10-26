import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./firebaseAdmin.js"; // colocado recien

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../")));

// ========================
// 🌐 RUTAS DE INTERFACES
// ========================
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../paginaPrincipal.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "../login.html")));
app.get("/registro", (req, res) => res.sendFile(path.join(__dirname, "../registro.html")));
app.get("/principal_tutor", (req, res) => res.sendFile(path.join(__dirname, "../principal_tutor.html")));
app.get("/principal_alumno", (req, res) => res.sendFile(path.join(__dirname, "../principal_alumno.html")));
app.get("/perfil", (req, res) => res.sendFile(path.join(__dirname, "../perfil.html")));
app.get("/perfil_tutor", (req, res) => res.sendFile(path.join(__dirname, "../perfil_tutor.html")));
app.get("/alumnos_inscri", (req, res) => res.sendFile(path.join(__dirname, "../alumnos_inscri.html")));
app.get("/emparejamiento", (req, res) => res.sendFile(path.join(__dirname, "../emparejamiento.html")));
app.get("/chat", (req, res) => res.sendFile(path.join(__dirname, "../chat.html")));
app.get("/chat_tutor", (req, res) => res.sendFile(path.join(__dirname, "../chat_tutor.html")));



// 📘 Obtener todos los usuarios (de ejemplo) recien...
app.get("/api/usuarios", async (req, res) => {
  try {
    const snapshot = await db.collection("Usuarios").get();
    const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener los datos desde Firestore" });
  }
});


// ========================
// 🚀 INICIAR SERVIDOR
// ========================
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
