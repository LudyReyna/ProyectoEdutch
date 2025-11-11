// 🔹 Control del menú responsive
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// 🔹 Cerrar sesión
const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Confirmación antes de cerrar sesión
    const confirmar = confirm("¿Seguro que deseas cerrar sesión?");
    if (confirmar) {
      // Aquí podrías limpiar datos del usuario o token
      localStorage.clear();
      sessionStorage.clear();

      // Redirigir al login
      window.location.href = "login.html";
    }
  });
}