import express from "express";
import { enviarMensaje, obtenerMensajes } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", enviarMensaje);
router.get("/", obtenerMensajes);

export default router; // 👈 ESTA LÍNEA ES CLAVE
