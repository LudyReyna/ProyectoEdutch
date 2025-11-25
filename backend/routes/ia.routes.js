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
// 🔑 FUNCIÓN EXPORTADA PARA MOCK EN TESTS
// ========================
export const getIAModel = () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
  } catch (err) {
    console.error("❌ Error creando modelo IA:", err);
    return null;
  }
};

// ========================
// 🔥 MODELO IA REAL
// (los tests lo reemplazarán con mock)
// ========================
export let model = getIAModel();

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
    const tutoresSnap = await db.collection("usuarios")
      .where("rol", "==", "tutor")
      .get();

    if (tutoresSnap.empty) {
      return res.status(404).json({ error: "No hay tutores registrados." });
    }

    const tutores = tutoresSnap.docs.map(doc => doc.data());
    console.log(`✅ ${tutores.length} tutores encontrados.`);

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

    const prompt = `
Eres una IA que empareja tutorados con tutores reales.

TUTORADO:
- Curso: ${curso}
- Nivel: ${nivel}
- Días: ${dias}
- Horario: ${horario}
- Modalidad: ${modalidad}
- Tipo de aprendizaje: ${tipoAprendizaje}

TUTORES DISPONIBLES:
${JSON.stringify(contexto, null, 2)}

Responde solo JSON:
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

    // ========================
    // ❗ VALIDACIÓN PARA TESTS
    // ========================
    if (!model || typeof model.generateContent !== "function") {
      return res.status(500).json({ error: "Error al inicializar modelo IA" });
    }

    console.log("🧠 Enviando prompt a Gemini...");
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    console.log("✅ Respuesta cruda de Gemini:", text);

    let match;
    try {
      match = JSON.parse(text);
    } catch (err) {
      console.warn("⚠️ La IA no devolvió JSON puro:", text);
      return res.status(500).json({
        error: "Respuesta IA no es JSON válido",
        raw: text,
      });
    }

    const respuestaFormateada = `
<div style="background:#fff;border-radius:15px;padding:20px;
box-shadow:0 4px 15px rgba(0,0,0,0.1);font-family:Poppins;">
  <h3 style="color:#e63946;text-align:center;">🎯 Tutor sugerido</h3>
  <p><strong>Nombre:</strong> ${match.nombre}</p>
  <p><strong>Curso:</strong> ${match.curso}</p>
  <p><strong>Nivel:</strong> ${match.nivel}</p>
  <p><strong>Modalidad:</strong> ${match.modalidad}</p>
  <p><strong>Compatibilidad:</strong> ${match.compatibilidad}</p>
  <p><strong>Razón:</strong> ${match.razon}</p>
</div>`;

    res.json({ respuesta: respuestaFormateada, raw: match });

  } catch (err) {
    console.error("❌ Error general IA:", err);
    res.status(500).json({ error: "Error interno en la IA" });
  }

});

// ========================
// 👌 Setter para tests
// ========================
export const __setTestModel = (newModel) => {
  model = newModel;
};

export default router;





