import { jest } from "@jest/globals"; 
import { generarSugerenciaIA } from "../controllers/ia.controller.js";

test("Debe manejar error interno de IA", async () => {
  const req = { body: {} }; // causa error de validación

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await generarSugerenciaIA(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});

