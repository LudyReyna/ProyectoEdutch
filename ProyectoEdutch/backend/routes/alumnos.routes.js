import express from "express";
import { registrarAlumno } from "../controllers/alumnosController.js";
const router = express.Router();
router.post("/", registrarAlumno);
export default router;


