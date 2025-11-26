import request from "supertest";
import app from "../server.js";

describe("Rutas HTML", () => {

test("GET /login debe responder 200", async () => {
    const res = await request(app).get("/login");
    expect(res.status).toBe(200);
});

test("GET /registro debe responder 200", async () => {
    const res = await request(app).get("/registro");
    expect(res.status).toBe(200);
});

test("GET / debe responder 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
});

});
