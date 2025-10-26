import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener ruta del archivo JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// Leer manualmente el archivo JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Inicializar Firebase Admin con Firestore (sin databaseURL)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Exportar servicios
export const db = admin.firestore();
export const auth = admin.auth();