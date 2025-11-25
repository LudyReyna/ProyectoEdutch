import { jest } from "@jest/globals";

// ===============================
// ❗ Mock Firebase ANTES de importar el server
// ===============================
jest.unstable_mockModule("../config/firebaseAdmin.js", () => ({
  db: {
    collection: () => ({
      where: () => ({
        get: async () => ({ empty: true })
      })
    })
  }
}));

// Importar router/modelo después del mock
const { __setTestModel } = await import("../routes/ia.routes.js");
const app = (await import("../server.js")).default;

import request from "supertest";

beforeAll(() => {
  __setTestModel({
    generateContent: async () => ({
      response: {
        text: () => `{"nombre":"X"}`
      }
    })
  });
});

test("Debe devolver error 400 si faltan campos", async () => {
  const res = await request(app)
    .post("/api/ia/emparejamiento")
    .send({});
  expect(res.status).toBe(400);
});

test("Debe devolver error 404 si no hay tutores", async () => {
  const res = await request(app)
    .post("/api/ia/emparejamiento")
    .send({
      curso: "M",
      nivel: "B",
      dias: "L",
      horario: "M",
      modalidad: "V",
      tipoAprendizaje: "A"
    });

  expect(res.status).toBe(404);
});


