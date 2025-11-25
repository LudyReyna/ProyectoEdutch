import { jest } from "@jest/globals";

// ========================
// 🧪 MOCK FIRESTORE (ESM)
// ========================
jest.unstable_mockModule("../config/firebaseAdmin.js", () => ({
    db: {
        collection: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnThis(),
            get: jest.fn().mockResolvedValue({
                empty: false,
                docs: [
                    {
                        id: "1",
                        data: () => ({
                            nombre: "Tutor MOCK",
                            curso: "Matemática",
                            nivel: "Básico",
                            dias: "Lunes",
                            horario: "Mañana",
                            modalidad: "Virtual",
                            metodo: "Visual",
                            experiencia: 1,
                            email: "mock@ucv.edu.pe"
                        })
                    }
                ]
            })
        })
    }
}));

// ========================
// 🧪 MOCK GEMINI (ESM)
// ========================
jest.unstable_mockModule("@google/generative-ai", () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: () => ({
            generateContent: async () => ({
                response: {
                    text: () => "ESTO NO ES UN JSON"  // JSON inválido
                }
            })
        })
    }))
}));

// ========================
// IMPORTAR APP DESPUÉS de mocks
// ========================
const app = (await import("../server.js")).default;

import request from "supertest";

// ========================
// TEST
// ========================
describe("IA - JSON inválido", () => {
    test("Debe devolver error si la IA no devuelve JSON válido", async () => {

        const res = await request(app)
            .post("/api/ia/emparejamiento")
            .send({
                curso: "Matemática",
                nivel: "Básico",
                dias: "Lunes",
                horario: "Mañana",
                modalidad: "Virtual",
                tipoAprendizaje: "Visual"
            });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Respuesta IA no es JSON válido");
    });
});

