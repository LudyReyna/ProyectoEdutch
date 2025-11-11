
// ========================
// 📦 IMPORTACIONES
// ========================
import express from "express";
import cors from "cors";
import helmet from "helmet"; // 🛡️ Protección adicional por cabeceras HTTP
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

// 🔒 Evitar exponer información de versión de Express
app.disable("x-powered-by");

// ========================
// ⚙️ CONFIGURAR CORS DE FORMA SEGURA
// ========================
const allowedOrigins = [
  "http://localhost:5173",           // Desarrollo (Vite)
  "http://localhost:3000",           // Servidor local
  "https://edumatch.vercel.app",     // Producción (ajusta tu dominio real)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (Postman, herramientas locales)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("🌐 Origen no permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // si usas cookies o tokens
};

// ========================
// 🧩 MIDDLEWARES
// ========================
app.use(cors(corsOptions));   // ✅ Seguridad mejorada
app.use(helmet());            // 🛡️ Cabeceras de seguridad automáticas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// 🌐 SERVIR FRONTEND
// ========================
app.use(express.static(path.resolve(__dirname, "../public")));
console.log("📂 Sirviendo archivos desde:", path.resolve(__dirname, "../public"));

// ========================
// 🔗 RUTAS DE API
// ========================
app.use("/api/ia", iaRoutes); // 🧠 Ruta para IA

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
  "paginaPrincipal", // 👈 añadida
];

// Generar rutas limpias automáticamente
pages.forEach((page) => {
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
    const usuarios = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener los datos desde Firestore" });
  }
});

// =========

