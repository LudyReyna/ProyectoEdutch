// ========================
// 📦 IMPORTACIONES
// ========================
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { db } from "./config/firebaseAdmin.js";
import iaRoutes from "./routes/ia.routes.js"; // 🧠 Ruta para IA

dotenv.config();

// ========================
// 📁 CONFIGURACIÓN BASE
// ========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable("x-powered-by"); // Oculta la versión de Express


// ========================
// ⚙️ MIDDLEWARES
// ========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://edumatch.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// ========================
// 🌐 SERVIR FRONTEND
// ========================
app.use(express.static(path.resolve(__dirname, "../public")));
console.log("📂 Sirviendo archivos desde:", path.resolve(__dirname, "../public"));

// ========================
// 🔗 RUTAS DE API
// ========================
app.use("/api/ia", iaRoutes); // Ruta para IA (si existe)

// ========================
// 🌐 RUTAS HTML SIN .html
// ========================
const pages = [
  "login",
  "registro",
  "principal_tutor",
  "principal_alumno",
  "perfil_tutor",
  "perfil",
  "alumnos_inscri",
  "emparejamiento",
  "chat_tutor",
  "chat",
  "paginaPrincipal" // 👈 añadida
];

// Genera automáticamente rutas limpias
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const filePath = path.resolve(__dirname, `../public/${page}.html`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`❌ Error al cargar ${page}.html:`, err);
        res.status(404).send("Página no encontrada");
      }
    });
  });
});

// Página raíz → página principal
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/paginaPrincipal.html"));
});

// ========================
// 📘 EJEMPLO DE FIRESTORE
// ========================
app.get("/api/usuarios", async (req, res) => {
  try {
    const snapshot = await db.collection("usuarios").get();
    const usuarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener los datos desde Firestore" });
  }
});

// ========================
// 🚀 INICIAR SERVIDOR
// ========================
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
