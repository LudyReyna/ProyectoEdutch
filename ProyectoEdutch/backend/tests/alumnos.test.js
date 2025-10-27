import request from "supertest";
import app from "../server_tdd.js";

describe("🟥 Registro de alumnos - Fase ROJA", () => {
  test("Debe registrar un alumno correctamente", async () => {
    const alumno = { nombre: "Fernando Medina", correo: "fmewq@ucvvirtual.edu.pe" };
    const res = await request(app).post("/api/alumnos").send(alumno);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("mensaje", "Alumno registrado correctamente");
  });
});
