import request from "supertest";
import app from "../server.js";

describe("CORS", () => {
test("Debe rechazar origen no permitido", async () => {
    const res = await request(app)
        .get("/")
        .set("Origin", "https://origen-malo.com");

    expect(res.status).toBe(500); // Express lanza error
});
});