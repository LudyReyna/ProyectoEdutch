// In-memory para TDD: Set de "tutor|tutorado"
const emparejamientos = new Set();

export const emparejar = (req, res) => {
  const { tutor, tutorado } = req.body;

  if (!tutor || !tutorado) {
    return res.status(400).json({ mensaje: "Datos faltantes" });
  }

  const clave = `${tutor}|${tutorado}`;
  if (emparejamientos.has(clave)) {
    return res.status(409).json({ mensaje: "Emparejamiento ya existe" });
  }

  emparejamientos.add(clave);
  return res.status(201).json({
    mensaje: "Emparejamiento exitoso",
    data: { tutor, tutorado },
  });
};

// Export opcional por si deseas inspeccionar en tests avanzados
export const __pairsStore = emparejamientos;
