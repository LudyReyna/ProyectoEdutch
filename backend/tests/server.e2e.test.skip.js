import request from "supertest";
import app from "../server.js";

describe("GET / (root)", () => {
test("La ruta raíz responde con algún status válido", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBeGreaterThanOrEqual(200);
});
});