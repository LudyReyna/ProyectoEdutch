// Controlador simple para registrar un alumno (modo TDD)
export const registrarAlumno = (req, res) => {
  const { nombre, correo } = req.body;

  // Validaciones básicas
  if (!nombre || !correo) {
    return res.status(400).json({ mensaje: "Datos incompletos" });
  }

  // Simular registro exitoso (sin BD aún)
  return res.status(201).json({
    mensaje: "Alumno registrado correctamente",
    alumno: { nombre, correo },
  });
};
