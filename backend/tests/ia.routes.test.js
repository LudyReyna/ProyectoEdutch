import { jest } from "@jest/globals";
import request from "supertest";

// ======================================================
// 1️⃣ MOCK DE FIREBASE
// ======================================================
jest.unstable_mockModule("../config/firebaseAdmin.js", () => {
  return {
    db: {
      collection: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          docs: [
            {
              id: "1",
              data: () => ({
                nombre: "Tutor 1",
                email: "t1@ucv.edu.pe",
                curso: "Matemática",
                nivel: "Intermedio",
                dias: "Lunes",
                horario: "Mañana",
                modalidad: "Virtual",
                metodo: "Visual",
                experiencia: 2,
              }),
            },
          ],
        }),
      }),
    },
  };
});

// ======================================================
// 2️⃣ MOCK DE GEMINI (RESPUESTA JSON VÁLIDA)
// ======================================================
jest.unstable_mockModule("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: async () => ({
          response: {
            text: () => `{
              "nombre": "Tutor 1",
              "email": "tutor1@ucv.edu.pe",
              "curso": "Matemática",
              "nivel": "Intermedio",
              "modalidad": "Virtual",
              "compatibilidad": "Alta",
              "razon": "Coincidencia excelente"
            }`,
          },
        }),
      }),
    })),
  };
});

// ======================================================
// 3️⃣ IMPORTAR SERVER Y LA FUNCIÓN __setTestModel DESPUÉS DE MOCKS
// ======================================================
const iaModule = await import("../routes/ia.routes.js");
const { __setTestModel } = iaModule;

const appModule = await import("../server.js");
const app = appModule.default;

// ======================================================
// 4️⃣ TEST PRINCIPAL — Tutor compatible
// ======================================================
describe("POST /api/ia/emparejamiento", () => {
  beforeEach(() => {
    // Restaurar modelo IA para pruebas normales
    __setTestModel({
      generateContent: async () => ({
        response: {
          text: () => `{
            "nombre": "Tutor 1",
            "email": "t1@ucv.edu.pe",
            "curso": "Matemática",
            "nivel": "Intermedio",
            "modalidad": "Virtual",
            "compatibilidad": "Alta",
            "razon": "Coincidencia excelente"
          }`,
        },
      }),
    });
  });

  test("Debe devolver un tutor compatible", async () => {
    const res = await request(app)
      .post("/api/ia/emparejamiento")
      .send({
        curso: "Matemática",
        nivel: "Básico",
        dias: "Lunes",
        horario: "Mañana",
        modalidad: "Virtual",
        tipoAprendizaje: "Visual",
      });

    expect(res.status).toBe(200);
    expect(res.body.raw.nombre).toBe("Tutor 1");
  });
});

// ======================================================
// 5️⃣ TEST — Modelo IA inexistente
// ======================================================
describe("POST /api/ia/emparejamiento - errores IA", () => {
  test("Debe devolver 500 si el modelo de IA no existe", async () => {
    // reemplaza el modelo real por NULL
    __setTestModel(null);

    const res = await request(app)
      .post("/api/ia/emparejamiento")
      .send({
        curso: "Matemática",
        nivel: "Básico",
        dias: "Lunes",
        horario: "Mañana",
        modalidad: "Virtual",
        tipoAprendizaje: "Visual",
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Error al inicializar modelo IA");
  });
});





