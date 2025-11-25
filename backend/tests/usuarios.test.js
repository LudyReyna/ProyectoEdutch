import { jest } from "@jest/globals";

// 1️⃣ Mock real del módulo firebaseAdmin.js
jest.unstable_mockModule("../config/firebaseAdmin.js", () => {
return {
    db: {
        collection: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
                docs: [
                    { id: "1", data: () => ({ nombre: "Fernando", rol: "tutor" }) },
                    { id: "2", data: () => ({ nombre: "Ashel", rol: "alumno" }) }
                ]
            })
        })
        }
    };
});

// 2️⃣ Importar después de mockear
const appModule = await import("../server.js");
const app = appModule.default;

import request from "supertest";

describe("GET /api/usuarios", () => {
test("Debe retornar un arreglo de usuarios", async () => {
    const res = await request(app).get("/api/usuarios");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].nombre).toBe("Fernando");
});
});

