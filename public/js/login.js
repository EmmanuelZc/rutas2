// Manejo de inicio de sesión
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Hacer una solicitud POST al backend para iniciar sesión
    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tipo de contenido JSON
      },
      body: JSON.stringify({ email, password }), // Enviar los datos del formulario
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Guardar el token JWT en el almacenamiento local
          localStorage.setItem("token", data.token);
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

// Función para verificar el rol del usuario y redirigir a la vista correspondiente
function checkUserRole() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/"; // Si no hay token, redirigir al login
    return;
  }

  // Decodificar el JWT (usando la librería jwt-decode)
  const decodedToken = jwt_decode(token);
  console.log("Decoded Token:", decodedToken);
  console.log("User Role:", decodedToken.role);

  // Verificar el rol y redirigir según el rol
  fetch("http://localhost:3000/auth/admin", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Enviar el token como "Authorization"
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (
        data.message === "Acceso no autorizado" ||
        data.message === "Token inválido o expirado"
      ) {
        alert("No tienes acceso a esta sección");
        window.location.href = "/"; // Si no es autorizado, redirigir a login
      } else {
        // Si es administrador, redirigir al panel
        window.location.href = "/auth/admin-dashboard"; // Redirigir a panel de administración
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error, por favor intente de nuevo");
    });
}
