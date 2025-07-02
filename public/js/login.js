// Verificar si el formulario existe antes de agregar el event listener
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Credenciales incorrectas");
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          alert("Inicio de sesión exitoso");
          checkUserRole();
        } else {
          alert(data.message || "Error en el inicio de sesión");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        alert(error.message || "Hubo un error, por favor intente de nuevo");
      });
  });
}
function checkUserRole() {
  fetch("http://localhost:3000/auth/verify-role", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al verificar rol");
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log("Datos del usuario:", data);
        if (data.role === "Administrador") {
          window.location.href = "/auth/admin-dashboard";
        } else if (data.role === "Visualizador") {
          window.location.href = "/auth/viewer-dashboard";
        } else {
          throw new Error("Rol no reconocido");
        }
      } else {
        throw new Error(data.message || "Error al verificar rol");
      }
    })
    .catch((error) => {
      console.error("Error en verificación de rol:", error);
      alert(error.message || "No tienes permiso para acceder");
      window.location.href = "/";
    });
}
function logout(event) {
  event.preventDefault();

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

// Función genérica para navegación protegida
function navigateTo(route, requiredRole = null) {
  return function (event) {
    if (event) event.preventDefault();

    // Primero verificar el rol si es necesario
    if (requiredRole) {
      fetch("http://localhost:3000/auth/verify-role", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error al verificar rol");
          return response.json();
        })
        .then((data) => {
          if (data.success && data.role === requiredRole) {
            window.location.href = `/auth/${route}`;
          } else {
            throw new Error(`Requiere rol ${requiredRole}`);
          }
        })
        .catch((error) => {
          console.error(`Error al acceder a ${route}:`, error);
          alert(error.message || "No tienes permiso para acceder");
          window.location.href = "/";
        });
    } else {
      window.location.href = `/auth/${route}`;
    }
  };
}

// Asignar funciones de navegación
document.addEventListener("DOMContentLoaded", function () {
  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
      event.preventDefault();
      fetch("http://localhost:3000/auth/logout", {
        method: "GET",
        credentials: "include",
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
    });
  }

  // Navegación protegida
  const adminDashboardBtn = document.getElementById("adminDashboardBtn");
  if (adminDashboardBtn) {
    adminDashboardBtn.addEventListener("click", navigateTo("admin-dashboard"));
  }

  const viewerDashboardBtn = document.getElementById("viewerDashboardBtn");
  if (viewerDashboardBtn) {
    viewerDashboardBtn.addEventListener(
      "click",
      navigateTo("viewer-dashboard")
    );
  }

  const gestionarRutasBtn = document.getElementById("gestionarRutasBtn");
  if (gestionarRutasBtn) {
    gestionarRutasBtn.addEventListener(
      "click",
      navigateTo("gestionarRutas", "Administrador")
    );
  }

  const gestionarParadasBtn = document.getElementById("gestionarParadasBtn");
  if (gestionarParadasBtn) {
    gestionarParadasBtn.addEventListener(
      "click",
      navigateTo("gestionarParadas", "Administrador")
    );
  }

  const gestionarUsuariosBtn = document.getElementById("gestionarUsuariosBtn");
  if (gestionarUsuariosBtn) {
    gestionarUsuariosBtn.addEventListener(
      "click",
      navigateTo("gestionarUsuarios", "Administrador")
    );
  }
});
