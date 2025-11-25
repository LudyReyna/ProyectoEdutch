import request from "supertest";
import app from "../server.js";

describe("CORS - origen no permitido", () => {
    test("Debe rechazar un origen no autorizado", async () => {
        const res = await request(app)
            .get("/api/usuarios")
            .set("Origin", "http://noautorizado.com");

        expect(res.status).toBe(500); 
    });
});
