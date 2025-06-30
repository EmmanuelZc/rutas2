document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("registerRole").value;

    fetch("http://localhost:3000/auth/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, role }),
      credentials: "include", // 🔥 Permitir que el navegador acepte cookies
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Registro exitoso") {
          alert("Cuenta creada exitosamente");
          window.location.href = "/auth/login"; // Redirigir a la página de login
        } else {
          alert(data.message || "Hubo un error al registrar el usuario");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error, por favor intente de nuevo");
      });
  });
