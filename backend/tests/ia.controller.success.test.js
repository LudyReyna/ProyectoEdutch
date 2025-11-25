import { generarSugerenciaIA } from "../controllers/ia.controller.js";
import { jest } from "@jest/globals";

// Mock global fetch
global.fetch = jest.fn();

describe("IA Controller - generarSugerenciaIA", () => {

beforeEach(() => {
    jest.clearAllMocks();
});

test("Debe devolver 200 y texto generado por IA", async () => {
    const fakeResponse = {
        json: () => Promise.resolve({
            candidates: [
                { content: { parts: [{ text: "Tutor ideal: Juan Pérez" }] } }
        ]
    })
    };

    fetch.mockResolvedValue(fakeResponse);

    const req = {
        body: { rol: "alumno", curso: "Matemática", nivel: "Básico", horario: "Mañana" }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await generarSugerenciaIA(req, res);

    expect(res.json).toHaveBeenCalledWith({
        respuesta: "Tutor ideal: Juan Pérez"
        });
    });

test("Debe devolver 500 si la API de Gemini falla", async () => {
    fetch.mockRejectedValue(new Error("Error en API"));

    const req = {
        body: { rol: "alumno", curso: "Matemática", nivel: "Básico", horario: "Mañana" }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    await generarSugerenciaIA(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        error: "Error interno del servidor"
    });
});
});
