// Simulación de tutorados asignados (luego se puede conectar a BD)
const tutorados = [
  { nombre: "María López", curso: "Matemáticas II", estado: "Activa" },
  { nombre: "Carlos Díaz", curso: "Programación I", estado: "Pendiente" },
  { nombre: "Lucía Ramos", curso: "Física General", estado: "Activa" },
  { nombre: "Andrés Flores", curso: "Estadística", estado: "Finalizada" }
];

// Cargar tabla
const tabla = document.querySelector("#tablaTutorados tbody");

tutorados.forEach((t) => {
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${t.nombre}</td>
    <td>${t.curso}</td>
    <td>${t.estado}</td>
    <td><button class="btn" onclick="abrirChat('${t.nombre}')">Chat</button></td>
  `;

  tabla.appendChild(fila);
});

function abrirChat(nombre) {
  alert(`Abriendo chat con ${nombre}...`);
  window.location.href = "chat_tutor.html";
}