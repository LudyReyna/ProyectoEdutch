import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// 🔹 Función para procesar emparejamientos con ayuda de Gemini
export const generarSugerenciaIA = async (req, res) => {
  try {
    const { rol, curso, nivel, horario } = req.body;

    if (!rol || !curso || !nivel || !horario) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // 🔸 Prompt dinámico
    const prompt = `
    Eres una IA educativa de emparejamiento académico llamada EduMatch.
    Tu tarea es sugerir el mejor emparejamiento entre un ${rol} y su contraparte
    en base a los siguientes datos:

    - Curso: ${curso}
    - Nivel: ${nivel}
    - Horario disponible: ${horario}

    Devuelve una respuesta corta, creativa y motivadora (en español).
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Error desde Gemini API:", data.error.message);
      return res.status(500).json({ error: data.error.message });
    }

    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta generada.";
    res.json({ respuesta: texto });

  } catch (error) {
    console.error("❌ Error en generarSugerenciaIA:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
