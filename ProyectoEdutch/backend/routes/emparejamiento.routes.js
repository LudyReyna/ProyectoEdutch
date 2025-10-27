import express from "express";
import { emparejar } from "../controllers/emparejamientoController.js";

const router = express.Router();

router.post("/", emparejar); // POST /api/emparejar

export default router;
