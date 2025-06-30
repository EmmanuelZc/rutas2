// Variables globales
let todasLasParadas = [];
let todasLasRutas = [];

// Función para inicializar la página
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación

  // Cargar datos iniciales
  cargarParadas();
  cargarRutasParaSelect();

  // Configurar eventos
  configurarEventos();

  // Mostrar campos de ubicación según el tipo seleccionado
  mostrarCamposUbicacion();
});

// Función para configurar eventos
function configurarEventos() {
  // Eventos de filtrado
  document
    .getElementById("btnFiltrar")
    .addEventListener("click", aplicarFiltros);
  document
    .getElementById("btnLimpiarFiltros")
    .addEventListener("click", limpiarFiltros);

  // Evento para filtrar al presionar Enter
  document.getElementById("filtroNombre").addEventListener("keypress", (e) => {
    if (e.key === "Enter") aplicarFiltros();
  });

  // Evento para el formulario de parada
  document
    .getElementById("formAgregarParada")
    .addEventListener("submit", guardarParada);

  // Limpiar formulario cuando se cierra el modal
  document
    .getElementById("addStopModal")
    .addEventListener("hidden.bs.modal", () => {
      const form = document.getElementById("formAgregarParada");
      form.reset();
      form.removeAttribute("data-id");
      document.getElementById("addStopModalLabel").textContent =
        "Agregar Nueva Parada";
    });
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
    mostrarParadas(todasLasParadas);
  } catch (error) {
    console.error("Error al cargar las paradas:", error);
    mostrarErrorEnTabla("Error al cargar las paradas");
  }
}

// Función para cargar rutas en el select
async function cargarRutasParaSelect() {
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

    // Llenar select en el formulario
    const selectRuta = document.getElementById("rutaIdParada");
    selectRuta.innerHTML = '<option value="">Seleccione una ruta</option>';

    todasLasRutas.forEach((ruta) => {
      const option = document.createElement("option");
      option.value = ruta.id;
      option.textContent = `${ruta.id} - ${ruta.nombre}`;
      selectRuta.appendChild(option);
    });

    // Llenar select en los filtros
    const selectFiltroRuta = document.getElementById("filtroRuta");
    selectFiltroRuta.innerHTML = '<option value="">Todas las rutas</option>';

    todasLasRutas.forEach((ruta) => {
      const option = document.createElement("option");
      option.value = ruta.id;
      option.textContent = `${ruta.id} - ${ruta.nombre}`;
      selectFiltroRuta.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las rutas:", error);
  }
}

// Función para mostrar paradas en la tabla
function mostrarParadas(paradas) {
  const tableBody = document
    .getElementById("tablaParadas")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  if (!Array.isArray(paradas)) {
    mostrarErrorEnTabla("Formato de datos inválido");
    return;
  }

  if (paradas.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="7" class="text-center">No se encontraron paradas</td>';
    tableBody.appendChild(tr);
    return;
  }

  paradas.forEach((parada) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${parada.id}</td>
            <td>${parada.nombre}</td>
            <td>${obtenerUbicacionTexto(parada)}</td>
            <td>${parada.orden}</td>
            <td>${obtenerNombreRuta(parada.ruta_id)}</td>
            <td>${parada.tipo_punto}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editarParada(${
                  parada.id
                })">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarParada(${
                  parada.id
                })">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
    tableBody.appendChild(tr);
  });
}

// Función auxiliar para obtener el texto de ubicación
function obtenerUbicacionTexto(parada) {
  switch (parada.tipo_punto) {
    case "Domicilio":
      return `${parada.calle} ${parada.numero}, ${parada.colonia}`;
    case "Carretera":
      return `${parada.carretera} km ${parada.kilometro}`;
    case "Lugar":
      return parada.descripcion;
    default:
      return "Ubicación no especificada";
  }
}

// Función auxiliar para obtener nombre de ruta
function obtenerNombreRuta(rutaId) {
  const ruta = todasLasRutas.find((r) => r.id === rutaId);
  return ruta ? `${ruta.id} - ${ruta.nombre}` : "Ruta desconocida";
}

// Función para mostrar error en la tabla
function mostrarErrorEnTabla(mensaje) {
  const tableBody = document
    .getElementById("tablaParadas")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">${mensaje}</td></tr>`;
}

// Función para aplicar filtros
function aplicarFiltros() {
  const filtroNombre = document
    .getElementById("filtroNombre")
    .value.trim()
    .toLowerCase();
  const filtroRuta = document.getElementById("filtroRuta").value;
  const filtroTipo = document.getElementById("filtroTipo").value;

  const paradasFiltradas = todasLasParadas.filter((parada) => {
    // Filtro por nombre
    const cumpleNombre =
      filtroNombre === "" ||
      parada.nombre.toLowerCase().includes(filtroNombre) ||
      obtenerUbicacionTexto(parada).toLowerCase().includes(filtroNombre);

    // Filtro por ruta
    const cumpleRuta =
      filtroRuta === "" || parada.ruta_id.toString() === filtroRuta;

    // Filtro por tipo
    const cumpleTipo = filtroTipo === "" || parada.tipo_punto === filtroTipo;

    return cumpleNombre && cumpleRuta && cumpleTipo;
  });

  mostrarParadas(paradasFiltradas);
}

// Función para limpiar filtros
function limpiarFiltros() {
  document.getElementById("filtroNombre").value = "";
  document.getElementById("filtroRuta").value = "";
  document.getElementById("filtroTipo").value = "";
  mostrarParadas(todasLasParadas);
}

// Función para mostrar campos de ubicación según el tipo seleccionado
function mostrarCamposUbicacion() {
  const tipo = document.getElementById("tipoPuntoParada").value;

  // Ocultar todos los campos primero
  document.getElementById("domicilioFields").classList.remove("active");
  document.getElementById("carreteraFields").classList.remove("active");
  document.getElementById("lugarFields").classList.remove("active");

  // Mostrar los campos correspondientes
  if (tipo === "Domicilio") {
    document.getElementById("domicilioFields").classList.add("active");
  } else if (tipo === "Carretera") {
    document.getElementById("carreteraFields").classList.add("active");
  } else if (tipo === "Lugar") {
    document.getElementById("lugarFields").classList.add("active");
  }
}

// Función para guardar una parada (crear o actualizar)
async function guardarParada(e) {
  e.preventDefault();

  const form = e.target;
  const token = localStorage.getItem("token");

  // Validar formulario
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  // Obtener datos del formulario
  const formData = obtenerDatosFormulario();

  // Validar datos
  if (!validarDatosParada(formData)) {
    return;
  }

  try {
    const formId = form.dataset.id;
    const url = formId ? `/paradas/${formId}` : "/paradas";
    const method = formId ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al procesar la solicitud");
    }

    alert(
      formId
        ? "Parada actualizada correctamente"
        : "Parada creada correctamente"
    );

    // Recargar la lista de paradas
    cargarParadas();

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addStopModal")
    );
    if (modal) modal.hide();
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
  }
}

// Función para obtener datos del formulario
function obtenerDatosFormulario() {
  const tipoPunto = document.getElementById("tipoPuntoParada").value;

  const formData = {
    nombre: document.getElementById("nombreParada").value.trim(),
    orden: parseInt(document.getElementById("ordenParada").value),
    ruta_id: parseInt(document.getElementById("rutaIdParada").value),
    tipo_punto: tipoPunto,
    latitud: parseFloat(document.getElementById("latitudParada").value),
    longitud: parseFloat(document.getElementById("longitudParada").value),
    tipo_transporte: document
      .getElementById("tipoTransporteParada")
      .value.trim(),
    capacidad_maxima:
      parseInt(document.getElementById("capacidadMaximaParada").value) || null,
    acceso_discapacitados: document.getElementById("accesoDiscapacitadosParada")
      .checked,
    area_descanso: document.getElementById("areaDescansoParada").checked,
    servicios_adicionales: document
      .getElementById("serviciosAdicionalesParada")
      .value.trim(),
    contacto_parada: document.getElementById("contactoParada").value.trim(),
    zona_peatonal: document.getElementById("zonaPeatonalParada").checked,
    horario_apertura: document.getElementById("horarioAperturaParada").value,
    horario_cierre: document.getElementById("horarioCierreParada").value,
  };

  // Agregar campos específicos según el tipo de punto
  if (tipoPunto === "Domicilio") {
    formData.calle = document.getElementById("calleParada").value.trim();
    formData.numero = document.getElementById("numeroParada").value.trim();
    formData.colonia = document.getElementById("coloniaParada").value.trim();
    formData.ciudad = document.getElementById("ciudadParada").value.trim();
    formData.codigo_postal = document.getElementById("cpParada").value.trim();
  } else if (tipoPunto === "Carretera") {
    formData.carretera = document
      .getElementById("carreteraParada")
      .value.trim();
    formData.kilometro = document.getElementById("kmParada").value.trim();
  } else if (tipoPunto === "Lugar") {
    formData.descripcion = document
      .getElementById("descripcionParada")
      .value.trim();
  }

  return formData;
}

// Función para validar datos de la parada
function validarDatosParada(data) {
  if (!data.nombre) {
    alert("Por favor ingrese un nombre para la parada");
    return false;
  }

  if (isNaN(data.orden) || data.orden < 1) {
    alert("Por favor ingrese un orden válido (mayor o igual a 1)");
    return false;
  }

  if (isNaN(data.ruta_id)) {
    alert("Por favor seleccione una ruta válida");
    return false;
  }

  if (isNaN(data.latitud) || isNaN(data.longitud)) {
    alert("Por favor ingrese coordenadas válidas");
    return false;
  }

  // Validar campos específicos según tipo de punto
  if (data.tipo_punto === "Domicilio") {
    if (!data.calle || !data.numero || !data.colonia || !data.ciudad) {
      alert("Por favor complete todos los campos obligatorios para domicilio");
      return false;
    }
  } else if (data.tipo_punto === "Carretera") {
    if (!data.carretera || !data.kilometro) {
      alert("Por favor complete todos los campos obligatorios para carretera");
      return false;
    }
  } else if (data.tipo_punto === "Lugar") {
    if (!data.descripcion) {
      alert("Por favor ingrese una descripción para el lugar");
      return false;
    }
  }

  return true;
}

// Función para editar una parada
async function editarParada(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/paradas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la parada");
    }

    const parada = await response.json();

    // Prellenar el formulario
    document.getElementById("nombreParada").value = parada.nombre || "";
    document.getElementById("ordenParada").value = parada.orden || "";
    document.getElementById("rutaIdParada").value = parada.ruta_id || "";
    document.getElementById("tipoPuntoParada").value =
      parada.tipo_punto || "Domicilio";
    document.getElementById("latitudParada").value = parada.latitud || "";
    document.getElementById("longitudParada").value = parada.longitud || "";
    document.getElementById("tipoTransporteParada").value =
      parada.tipo_transporte || "";
    document.getElementById("capacidadMaximaParada").value =
      parada.capacidad_maxima || "";
    document.getElementById("serviciosAdicionalesParada").value =
      parada.servicios_adicionales || "";
    document.getElementById("contactoParada").value =
      parada.contacto_parada || "";
    document.getElementById("horarioAperturaParada").value =
      parada.horario_apertura || "";
    document.getElementById("horarioCierreParada").value =
      parada.horario_cierre || "";
    document.getElementById("accesoDiscapacitadosParada").checked =
      parada.acceso_discapacitados || false;
    document.getElementById("areaDescansoParada").checked =
      parada.area_descanso || false;
    document.getElementById("zonaPeatonalParada").checked =
      parada.zona_peatonal || false;

    // Prellenar campos específicos según tipo de punto
    if (parada.tipo_punto === "Domicilio") {
      document.getElementById("calleParada").value = parada.calle || "";
      document.getElementById("numeroParada").value = parada.numero || "";
      document.getElementById("coloniaParada").value = parada.colonia || "";
      document.getElementById("ciudadParada").value = parada.ciudad || "";
      document.getElementById("cpParada").value = parada.codigo_postal || "";
    } else if (parada.tipo_punto === "Carretera") {
      document.getElementById("carreteraParada").value = parada.carretera || "";
      document.getElementById("kmParada").value = parada.kilometro || "";
    } else if (parada.tipo_punto === "Lugar") {
      document.getElementById("descripcionParada").value =
        parada.descripcion || "";
    }

    // Mostrar los campos correspondientes
    mostrarCamposUbicacion();

    // Establecer ID en el formulario
    const form = document.getElementById("formAgregarParada");
    form.dataset.id = id;

    // Cambiar título del modal
    document.getElementById("addStopModalLabel").textContent = "Editar Parada";

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById("addStopModal"));
    modal.show();
  } catch (error) {
    console.error("Error al obtener la parada:", error);
    alert(`Error al cargar la parada: ${error.message}`);
  }
}

// Función para eliminar una parada
async function eliminarParada(id) {
  if (!confirm("¿Está seguro de eliminar esta parada?")) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/paradas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar la parada");
    }

    alert("Parada eliminada exitosamente");
    cargarParadas();
  } catch (error) {
    console.error("Error al eliminar la parada:", error);
    alert(`Error al eliminar la parada: ${error.message}`);
  }
}

// Función para cerrar sesión
function logout(e) {
  e.preventDefault();
  localStorage.removeItem("token");
  window.location.href = "/";
}
