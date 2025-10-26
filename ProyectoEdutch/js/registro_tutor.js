const form = document.getElementById("formTutoria");
const tabla = document.querySelector("#tablaTutorias tbody");

// Cargar tutorías previas desde localStorage
let tutorias = JSON.parse(localStorage.getItem("tutorias_tutor")) || [];

// Mostrar tutorías guardadas
function mostrarTutorias() {
  tabla.innerHTML = "";
  tutorias.forEach((t, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${t.nombreEstudiante}</td>
      <td>${t.curso}</td>
      <td>${t.tema}</td>
      <td>${t.fecha}</td>
      <td>${t.estado}</td>
      <td><button class="btn-eliminar" data-index="${index}">🗑 Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });

  // Asignar evento a los botones de eliminar
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      eliminarTutoria(index);
    });
  });
}

// Guardar nueva tutoría
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevaTutoria = {
    nombreEstudiante: document.getElementById("nombreEstudiante").value,
    curso: document.getElementById("curso").value,
    tema: document.getElementById("tema").value,
    fecha: document.getElementById("fecha").value,
    estado: document.getElementById("estado").value,
  };

  tutorias.push(nuevaTutoria);
  localStorage.setItem("tutorias_tutor", JSON.stringify(tutorias));
  form.reset();
  mostrarTutorias();
});

// Eliminar tutoría por índice
function eliminarTutoria(index) {
  if (confirm("¿Estás seguro de eliminar esta tutoría?")) {
    tutorias.splice(index, 1);
    localStorage.setItem("tutorias_tutor", JSON.stringify(tutorias));
    mostrarTutorias();
  }
}

// Inicializar vista
mostrarTutorias();
