// Variables globales para almacenar las rutas y paradas
let todasLasRutas = [];
let todasLasParadas = [];

// Función para inicializar la página
document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos iniciales
  cargarRutas();
  cargarParadas();
});

// Función para cargar todas las rutas
async function cargarRutas() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/rutas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las rutas");
    }

    todasLasRutas = await response.json();
    mostrarRutas(todasLasRutas); // Mostrar rutas en la tabla
  } catch (error) {
    console.error("Error al cargar las rutas:", error);
    mostrarErrorEnTabla("Error al cargar las rutas");
  }
}

// Función para cargar todas las paradas
async function cargarParadas() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/paradas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las paradas");
    }

    todasLasParadas = await response.json();
    mostrarParadas(todasLasParadas); // Mostrar paradas en la tabla
  } catch (error) {
    console.error("Error al cargar las paradas:", error);
    mostrarErrorEnTabla("Error al cargar las paradas");
  }
}

// Función para mostrar las rutas en la tabla
function mostrarRutas(rutas) {
  const tablaRutas = document
    .getElementById("tablaRutas")
    .getElementsByTagName("tbody")[0];
  tablaRutas.innerHTML = ""; // Limpiar tabla

  if (rutas.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" class="text-center">No se encontraron rutas</td>`;
    tablaRutas.appendChild(tr);
    return;
  }

  rutas.forEach((ruta) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ruta.id}</td>
      <td>${ruta.nombre}</td>
      <td>${ruta.horario || "Sin horario"}</td>
      <td><span class="badge ${getBadgeClass(ruta.estado)}">${
      ruta.estado
    }</span></td>
    `;
    tablaRutas.appendChild(tr);
  });
}

// Función para mostrar las paradas en la tabla
function mostrarParadas(paradas) {
  const tableBody = document
    .getElementById("tablaParadas")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = ""; // Limpiar tabla

  if (paradas.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" class="text-center">No se encontraron paradas</td>`;
    tableBody.appendChild(tr);
    return;
  }

  paradas.forEach((parada) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${parada.id}</td>
      <td>${parada.nombre}</td>
      <td>${obtenerNombreRuta(parada.ruta_id)}</td>
      <td>${parada.orden}</td>
      
    `;
    tableBody.appendChild(tr);
  });
}

// Función para obtener el nombre de la ruta dado un ID
function obtenerNombreRuta(rutaId) {
  const ruta = todasLasRutas.find((r) => r.id === rutaId);
  return ruta ? ruta.nombre : "Ruta no encontrada";
}

// Función para obtener la clase de la etiqueta de estado
function getBadgeClass(estado) {
  switch (estado) {
    case "Activa":
      return "bg-success";
    case "Inactiva":
      return "bg-secondary";
    case "En mantenimiento":
      return "bg-warning text-dark";
    default:
      return "bg-light";
  }
}

// Función para eliminar una parada
async function eliminarParada(id) {
  if (confirm("¿Está seguro de eliminar esta parada?")) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/paradas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la parada");
      }

      alert("Parada eliminada correctamente");
      cargarParadas(); // Recargar paradas
    } catch (error) {
      console.error("Error al eliminar la parada:", error);
      alert("Ocurrió un error al eliminar la parada");
    }
  }
}

// Función para eliminar una ruta
async function eliminarRuta(id) {
  if (confirm("¿Está seguro de eliminar esta ruta?")) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/rutas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la ruta");
      }

      alert("Ruta eliminada correctamente");
      cargarRutas(); // Recargar rutas
    } catch (error) {
      console.error("Error al eliminar la ruta:", error);
      alert("Ocurrió un error al eliminar la ruta");
    }
  }
}

// Función para cerrar sesión
function logout(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  window.location.href = "/"; // Redirigir al inicio
}
