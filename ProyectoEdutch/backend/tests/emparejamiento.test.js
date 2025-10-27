import request from "supertest";
import app from "../server_tdd.js";

describe("🧠 Emparejamiento tutor–tutorado", () => {
  const payload = {
    tutor: "mire2@ucvvirtual.edu.pe",
    tutorado: "lu@ucvvirtual.edu.pe",
  };

  test("POST /api/emparejar debe crear emparejamiento", async () => {
    const res = await request(app).post("/api/emparejar").send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("mensaje", "Emparejamiento exitoso");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toMatchObject(payload);
  });

  test("POST /api/emparejar debe rechazar duplicados", async () => {
    // mismo payload otra vez
    const res = await request(app).post("/api/emparejar").send(payload);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("mensaje", "Emparejamiento ya existe");
  });

  test("POST /api/emparejar debe validar datos", async () => {
    const res = await request(app).post("/api/emparejar").send({ tutor: "x" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("mensaje", "Datos faltantes");
  });
});
