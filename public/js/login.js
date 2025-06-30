document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // 🔥 Permitir que el navegador acepte cookies
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login exitoso") {
          alert("Inicio de sesión exitoso");
          checkUserRole();
        } else {
          alert(data.message || "Correo o contraseña incorrectos");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error, por favor intente de nuevo");
      });
  });

function checkUserRole() {
  fetch("http://localhost:3000/auth/admin", {
    method: "GET",
    credentials: "include", // 🔥 enviar cookie
  })
    .then((response) => {
      if (!response.ok) throw new Error("Acceso denegado");
      return response.text(); // Si es HTML, como el dashboard
    })
    .then((html) => {
      // Redirigir manualmente o reemplazar contenido
      window.location.href = "/auth/admin-dashboard"; // O mostrar directamente el contenido
    })
    .catch((error) => {
      console.error("Error en verificación de rol:", error);
      alert("No tienes permiso para acceder");
      window.location.href = "/";
    });
}
function logout(event) {
  if (event) event.preventDefault(); // Evita que el <a href="#"> recargue la página

  fetch("http://localhost:3000/auth/logout", {
    method: "GET",
    credentials: "include", // Enviar la cookie
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error en logout:", error);
      alert("Hubo un error al cerrar sesión");
    });
}

function gestionarRutas(event) {
  if (event) event.preventDefault(); // Evita que el <a href="#"> recargue la página

  fetch("http://localhost:3000/auth/gestionarRutas", {
    method: "GET",
    credentials: "include", // Enviar la cookie
  })
    .then((response) => {
      if (!response.ok) throw new Error("Acceso denegado");
      return response.text(); // Si es HTML, como el dashboard
    })
    .then((html) => {
      // Redirigir manualmente o reemplazar contenido
      window.location.href = "/auth/gestionarRutas";
    })
    .catch((error) => {
      console.error("Error en gestionar rutas:", error);
      alert("No tienes permiso para acceder a gestionar rutas");
      window.location.href = "/";
    });
}
function adminDashboard(event) {
  if (event) event.preventDefault(); // Evita que el <a href="#"> recargue la página

  fetch("http://localhost:3000/auth/gestionarRutas", {
    method: "GET",
    credentials: "include", // Enviar la cookie
  })
    .then((response) => {
      if (!response.ok) throw new Error("Acceso denegado");
      return response.text(); // Si es HTML, como el dashboard
    })
    .then((html) => {
      // Redirigir manualmente o reemplazar contenido
      window.location.href = "/auth/gestionarRutas";
    })
    .catch((error) => {
      console.error("Error en gestionar rutas:", error);
      alert("No tienes permiso para acceder a gestionar rutas");
      window.location.href = "/";
    });
}

function gestionarParadas(event) {
  if (event) event.preventDefault(); // Evita que el <a href="#"> recargue la página

  fetch("http://localhost:3000/auth/gestionarParadas", {
    method: "GET",
    credentials: "include", // Enviar la cookie
  })
    .then((response) => {
      if (!response.ok) throw new Error("Acceso denegado");
      return response.text(); // Si es HTML, como el dashboard
    })
    .then((html) => {
      // Redirigir manualmente o reemplazar contenido
      window.location.href = "/auth/gestionarParadas";
    })
    .catch((error) => {
      console.error("Error en gestionar rutas:", error);
      alert("No tienes permiso para acceder a gestionar rutas");
      window.location.href = "/";
    });
}

function gestionarUsuarios(event) {
  if (event) event.preventDefault(); // Evita que el <a href="#"> recargue la página

  fetch("http://localhost:3000/auth/gestionarUsuarios", {
    method: "GET",
    credentials: "include", // Enviar la cookie
  })
    .then((response) => {
      if (!response.ok) throw new Error("Acceso denegado");
      return response.text(); // Si es HTML, como el dashboard
    })
    .then((html) => {
      // Redirigir manualmente o reemplazar contenido
      window.location.href = "/auth/gestionarUsuarios";
    })
    .catch((error) => {
      console.error("Error en gestionar rutas:", error);
      alert("No tienes permiso para acceder a gestionar rutas");
      window.location.href = "/";
    });
}
