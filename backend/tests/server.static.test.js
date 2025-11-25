import request from "supertest";
import app from "../server.js";

test("Debe responder archivo estático", async () => {
    const res = await request(app).get("/");
    // No importa el contenido, solo que responda
    expect(res.status).toBe(200);
});
