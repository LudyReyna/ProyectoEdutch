// Almacenamiento en memoria para TDD (puedes cambiar luego a Firestore)
const chats = new Map(); 
// key: chatId  -> value: array de mensajes [{remitente, contenido, creadoEn}]

export const enviarMensaje = (req, res) => {
  const { chatId, remitente, contenido } = req.body;

  if (!chatId || !remitente || !contenido) {
    return res.status(400).json({ mensaje: "Datos incompletos" });
  }

  const creadoEn = new Date().toISOString();
  const msg = { chatId, remitente, contenido, creadoEn };

  if (!chats.has(chatId)) chats.set(chatId, []);
  chats.get(chatId).push(msg);

  return res.status(201).json({ mensaje: "Mensaje enviado", data: msg });
};

export const obtenerMensajes = (req, res) => {
  const { chatId } = req.query;
  if (!chatId) {
    return res.status(400).json({ mensaje: "chatId requerido" });
  }
  const lista = chats.get(chatId) || [];
  // ordenar por timestamp ascendente
  const ordenados = [...lista].sort(
    (a, b) => new Date(a.creadoEn) - new Date(b.creadoEn)
  );
  return res.status(200).json({ mensajes: ordenados });
};

// Export opcional para pruebas de estado (si luego quieres inspeccionar)
export const __chatsStore = chats;
