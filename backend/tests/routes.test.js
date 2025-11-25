import request from "supertest";
import app from "../server.js";

describe("Rutas HTML principales", () => {
    test("GET / debe responder 200", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("<!DOCTYPE"); // Verifica que devolvió HTML
    });

    test("GET /login debe responder 200", async () => {
    const res = await request(app).get("/login");
    expect(res.status).toBe(200);
    });

    test("GET /noexiste debe devolver 404", async () => {
    const res = await request(app).get("/noexiste-ruta");
    expect(res.status).toBe(404);
    });
});