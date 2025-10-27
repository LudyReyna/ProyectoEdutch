import request from "supertest";
import app from "../server_tdd.js";

describe("💬 Chat tutor–tutorado", () => {
  test("POST /api/chat debe registrar un mensaje", async () => {
    const mensaje = {
      chatId: "lu@ucvvirtual.edu.pe_mire2@ucvvirtual.edu.pe",
      remitente: "lu@ucvvirtual.edu.pe",
      contenido: "Hola tutor!",
    };

    const res = await request(app).post("/api/chat").send(mensaje);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("mensaje", "Mensaje enviado");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toMatchObject({
      chatId: mensaje.chatId,
      remitente: mensaje.remitente,
      contenido: mensaje.contenido,
    });
    expect(res.body.data).toHaveProperty("creadoEn"); // timestamp
  });

  test("GET /api/chat?chatId=... debe devolver historial del chat", async () => {
    const chatId = "lu@ucvvirtual.edu.pe_mire2@ucvvirtual.edu.pe";
    const res = await request(app).get(`/api/chat`).query({ chatId });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.mensajes)).toBe(true);
    // al menos 1 mensaje (el del test anterior)
    expect(res.body.mensajes.length).toBeGreaterThan(0);
    // ordenados por creadoEn ascendente
    const sorted = [...res.body.mensajes].sort(
      (a, b) => new Date(a.creadoEn) - new Date(b.creadoEn)
    );
    expect(res.body.mensajes).toEqual(sorted);
  });

  test("POST /api/chat debe validar datos incompletos", async () => {
    const res = await request(app).post("/api/chat").send({ contenido: "..." });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("mensaje", "Datos incompletos");
  });
});
