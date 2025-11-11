// ========================
// 🤖 EMPAREJAMIENTO IA - CON FORMATO VISUAL
// ========================
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../config/firebaseAdmin.js";

dotenv.config();
const router = express.Router();

// ========================
// 🔑 CONFIGURACIÓN GEMINI
// ========================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.0-flash", // ✅ Modelo estable
  generationConfig: {
    responseMimeType: "application/json", // Fuerza salida JSON
  },
});

// ========================
// 📘 EMPAREJAMIENTO POST
// ========================
router.post("/emparejamiento", async (req, res) => {
  try {
    const { curso, nivel, dias, horario, modalidad, tipoAprendizaje } = req.body;

    if (!curso || !nivel || !dias || !horario || !modalidad || !tipoAprendizaje) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    console.log("📩 Datos recibidos:", req.body);

    // 🔍 Buscar tutores reales
    const tutoresSnap = await db.collection("usuarios").where("rol", "==", "tutor").get();
    if (tutoresSnap.empty) return res.status(404).json({ error: "No hay tutores registrados." });

    const tutores = tutoresSnap.docs.map(doc => doc.data());
    console.log(`✅ ${tutores.length} tutores encontrados.`);

    // 🧠 Crear contexto con tutores reales
    const contexto = tutores.map(t => ({
      nombre: t.nombre,
      email: t.email,
      curso: t.curso,
      nivel: t.nivel,
      dias: t.dias,
      horario: t.horario,
      modalidad: t.modalidad,
      metodo: t.metodo,
      experiencia: t.experiencia,
    }));

    // 💬 Prompt de IA estructurado
    const prompt = `
Eres una IA que empareja tutorados con tutores reales de una universidad.

Selecciona el tutor más compatible con el siguiente estudiante:

TUTORADO:
- Curso: ${curso}
- Nivel: ${nivel}
- Días: ${dias}
- Horario: ${horario}
- Modalidad: ${modalidad}
- Tipo de aprendizaje: ${tipoAprendizaje}

TUTORES DISPONIBLES:
${JSON.stringify(contexto, null, 2)}

Responde exclusivamente en formato JSON con este modelo exacto:
{
  "nombre": "",
  "email": "",
  "curso": "",
  "nivel": "",
  "modalidad": "",
  "compatibilidad": "",
  "razon": ""
}
`;

    console.log("🧠 Enviando prompt a Gemini...");
    const result = await model.generateContent(prompt);

    const text = result.response.text().trim();
    console.log("✅ Respuesta cruda de Gemini:", text);

    // 🧩 Intentar parsear la respuesta
    let match;
    try {
      match = JSON.parse(text);
    } catch (err) {
      console.warn("⚠️ La IA no devolvió JSON puro, texto recibido:", text);
      return res.status(500).json({ error: "Respuesta IA no es JSON válido", raw: text });
    }

    // 🎨 Formato final profesional
    const respuestaFormateada = `
<div style="
  background:#ffffff;
  border-radius:15px;
  box-shadow:0 4px 15px rgba(0,0,0,0.1);
  padding:20px 25px;
  font-family:'Poppins',sans-serif;
  max-width:600px;
  margin:20px auto;
  color:#333;
">
  <h3 style="color:#e63946;text-align:center;margin-bottom:15px;">🎯 Tutor sugerido</h3>
  <p><strong>👩‍🏫 Nombre:</strong> ${match.nombre || "No identificado"}</p>
  <p><strong>📘 Curso:</strong> ${match.curso || "-"}</p>
  <p><strong>🎓 Nivel:</strong> ${match.nivel || "-"}</p>
  <p><strong>💻 Modalidad:</strong> ${match.modalidad || "-"}</p>
  <p><strong>📧 Contacto:</strong> <a href="mailto:${match.email}" style="color:#e63946;">${match.email}</a></p>
  <p><strong>📊 Compatibilidad:</strong> ${match.compatibilidad || "-"}</p>
  <p><strong>🗣️ Motivo:</strong> ${match.razon || "Sin descripción"}</p>
</div>
`;

    // 🔁 Enviar respuesta al frontend
    res.json({ respuesta: respuestaFormateada, raw: match });

  } catch (error) {
    console.error("❌ Error general en IA:", error);
    res.status(500).json({
      error: "Error interno en la IA",
      detalle: error.message,
    });
  }
});

export default router;



