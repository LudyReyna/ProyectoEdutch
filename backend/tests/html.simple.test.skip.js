import request from "supertest";
import app from "../server.js";

describe("Rutas HTML básicas", () => {
    test("Debe devolver la página principal", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
    });

    test("Debe devolver login.html", async () => {
        const res = await request(app).get("/login");
        expect(res.status).toBe(200);
    });
});
