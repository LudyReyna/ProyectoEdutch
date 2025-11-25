import { generarSugerenciaIA } from "../controllers/ia.controller.js";
import { jest } from "@jest/globals";
describe("Pruebas de generarSugerenciaIA", () => {
test("Debe retornar 400 si faltan campos", async () => {
    const req = { body: { rol: "", curso: "", nivel: "", horario: "" } };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await generarSugerenciaIA(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error: "Faltan campos obligatorios.",
    });
});
});