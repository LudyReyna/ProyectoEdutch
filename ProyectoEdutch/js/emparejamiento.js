

// Cuando el documento esté listo
document.addEventListener("DOMContentLoaded", async () => {
  const formMatch = document.getElementById("formMatch");
  const progress = document.getElementById("progress");
  const progressBar = document.querySelector(".progress-bar");
  const status = document.getElementById("status");
  const matchInfo = document.getElementById("matchInfo");
  const logoutBtn = document.getElementById("logoutBtn");

  // 📥 Cargar tutores y tutorados desde Firestore
  const tutoresSnapshot = await getDocs(collection(db, "tutores"));
  const tutoradosSnapshot = await getDocs(collection(db, "tutorados"));

  const tutores = tutoresSnapshot.docs.map(doc => doc.data());
  const tutorados = tutoradosSnapshot.docs.map(doc => doc.data());

  formMatch.addEventListener("submit", async (e) => {
    e.preventDefault();

    const rol = document.getElementById("rol").value;
    const curso = document.getElementById("curso").value.trim();
    const nivel = document.getElementById("nivel").value;
    const horario = document.getElementById("horario").value.trim();

    matchInfo.classList.add("hidden");
    progressBar.style.display = "block";
    progress.style.width = "0%";
    status.textContent = "Analizando coincidencias...";
    let progreso = 0;

    // Simula proceso de búsqueda
    const interval = setInterval(() => {
      progreso += 10;
      progress.style.width = progreso + "%";

      if (progreso >= 100) {
        clearInterval(interval);
        progressBar.style.display = "none";

        let resultado;
        if (rol === "tutor") {
          resultado = tutorados.find(t => t.curso.toLowerCase() === curso.toLowerCase());
        } else {
          resultado = tutores.find(t => t.curso.toLowerCase() === curso.toLowerCase());
        }

        if (resultado) {
          status.textContent = "¡Emparejamiento exitoso!";
          matchInfo.classList.remove("hidden");
          matchInfo.innerHTML = `
            <h3>Tu coincidencia ideal es:</h3>
            <p><strong>${resultado.nombre}</strong></p>
            <p>📘 Curso: ${resultado.curso}</p>
            <p>🎓 Nivel: ${resultado.nivel}</p>
            <p>🕒 Horario compatible: ${resultado.horario}</p>
          `;
        } else {
          status.textContent = "No se encontraron coincidencias exactas 😞";
        }
      }
    }, 300);
  });

  // Cerrar sesión
  logoutBtn.addEventListener("click", () => {
    if (confirm("¿Deseas cerrar sesión?")) {
      window.location.href = "login.html";
    }
  });
});
