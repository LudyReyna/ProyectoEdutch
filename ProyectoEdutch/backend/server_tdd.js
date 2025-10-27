import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import alumnosRoutes from "./routes/alumnos.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import empRoutes from "./routes/emparejamiento.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

// Rutas API
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/emparejar", empRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Servidor activo 🚀");
});

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}

export default app;
