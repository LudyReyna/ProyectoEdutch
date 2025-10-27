document.addEventListener("DOMContentLoaded", () => {
  const completarBtns = document.querySelectorAll(".completar");
  const nuevaTutoriaBtn = document.getElementById("nuevaTutoriaBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".close");
  const formTutoria = document.getElementById("formTutoria");
  const tablaBody = document.getElementById("tablaBody");

  // Función para completar tutorías existentes
  function activarCompletarBotones() {
    document.querySelectorAll(".completar").forEach(btn => {
      btn.addEventListener("click", () => {
        const fila = btn.closest("tr");
        const estadoCell = fila.querySelector(".estado");
        const retroCell = fila.querySelectorAll("td")[5];

        const retro = prompt("Ingresa una retroalimentación para esta tutoría:");
        if (retro) {
          estadoCell.textContent = "Completada";
          estadoCell.className = "estado completada";
          retroCell.textContent = retro;
          btn.textContent = "Finalizada";
          btn.className = "disabled";
          btn.disabled = true;
          alert("✅ Tutoría marcada como completada");
        }
      });
    });
  }

  activarCompletarBotones();

  // Abrir modal
  nuevaTutoriaBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Cerrar modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar si clic fuera del modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Registrar nueva tutoría
  formTutoria.addEventListener("submit", (e) => {
    e.preventDefault();

    const fecha = document.getElementById("fecha").value;
    const nombre = document.getElementById("nombre").value;
    const curso = document.getElementById("curso").value;
    const tema = document.getElementById("tema").value;

    // Crear nueva fila
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td>${fecha}</td>
      <td>${nombre}</td>
      <td>${curso}</td>
      <td>${tema}</td>
      <td><span class="estado pendiente">Pendiente</span></td>
      <td>-</td>
      <td><button class="completar">Completar</button></td>
    `;

    tablaBody.appendChild(nuevaFila);
    modal.style.display = "none";
    formTutoria.reset();
    activarCompletarBotones();

    alert("✅ Nueva tutoría registrada correctamente");
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    if (confirm("¿Deseas cerrar sesión?")) {
      window.location.href = "login.html";
    }
  });
});
