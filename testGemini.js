import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  try {
    const prompt = "Dame una recomendación divertida para un emparejamiento entre tutor y alumno 👩‍🏫";

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("❌ Error desde Gemini API:", data.error.message);
    } else {
      console.log("\n✅ Respuesta de Gemini:\n");
      console.log(data.candidates[0].content.parts[0].text);
    }
  } catch (error) {
    console.error("❌ Error probando Gemini:", error);
  }
}

testGemini();









