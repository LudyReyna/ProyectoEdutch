import { generarSugerenciaIA } from "../controllers/ia.controller.js";
import { jest } from "@jest/globals";

describe("Validación de campos en generarSugerenciaIA", () => {
    test("Debe devolver 400 si falta un campo", async () => {
        const req = { body: { rol: "tutor", curso: "", nivel: "Básico", horario: "Mañana" } };

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
