// Variable global para almacenar todas las rutas
let todasLasRutas = [];

document.addEventListener("DOMContentLoaded", function () {
  // Cargar rutas iniciales
  cargarRutas();

  // Configurar filtros
  configurarFiltros();
  mostrarCamposOrigen();
  mostrarCamposDestino();

  // Configurar el evento submit del formulario
  document
    .getElementById("formAgregarRuta")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      agregarRuta();
    });
});

function cargarRutas() {
  console.log("Cargando rutas...");

  // Realizamos la solicitud para obtener todas las rutas
  fetch("/rutas/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener las rutas");
      }
      return response.json();
    })
    .then((rutas) => {
      console.log("Rutas recibidas:", rutas);

      // Guardar todas las rutas para filtrado local
      todasLasRutas = rutas;

      // Mostrar todas las rutas inicialmente
      mostrarRutas(rutas);
    })
    .catch((error) => {
      console.error("Error al obtener las rutas:", error);
      const tablaRutas = document
        .getElementById("tablaRutas")
        .getElementsByTagName("tbody")[0];
      tablaRutas.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar las rutas</td></tr>`;
    });
}

function mostrarRutas(rutas) {
  const tablaRutas = document
    .getElementById("tablaRutas")
    .getElementsByTagName("tbody")[0];

  if (!tablaRutas) {
    console.error("No se encontró la tabla de rutas");
    return;
  }

  tablaRutas.innerHTML = ""; // Limpiar tabla

  // Validar que rutas sea un array
  if (!Array.isArray(rutas)) {
    console.error("Las rutas no son un array válido:", rutas);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" class="text-center text-warning">Formato de datos inválido</td>`;
    tablaRutas.appendChild(tr);
    return;
  }

  if (rutas.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" class="text-center">No se encontraron rutas con los filtros aplicados</td>`;
    tablaRutas.appendChild(tr);
    return;
  }

  // Llenar la tabla con las rutas
  rutas.forEach((ruta) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ruta.id || "N/A"}</td>
      <td>
        <strong>${ruta.nombre || "Sin nombre"}</strong>
        <div class="text-muted small">${
          ruta.descripcion || "Sin descripción"
        }</div>
      </td>
      <td>${ruta.horario || "Sin horario"}</td>
      <td><span class="badge ${getBadgeClass(ruta.estado)}">${
      ruta.estado || "Sin estado"
    }</span></td>
      <td class="action-btns">
        <button class="btn btn-sm btn-outline-primary" title="Editar" onclick="editarRuta(${
          ruta.id
        })">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" title="Eliminar" onclick="eliminarRuta(${
          ruta.id
        })">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tablaRutas.appendChild(tr);
  });
}

function aplicarFiltros() {
  const buscarInput = document.getElementById("filtroNombre");
  const estadoSelect = document.getElementById("filtroEstado");

  if (!buscarInput || !estadoSelect) {
    console.error("No se encontraron los elementos de filtro");
    return;
  }

  const filtroNombre = buscarInput.value.trim().toLowerCase();
  const filtroEstado = estadoSelect.value;

  console.log("Aplicando filtros:", {
    nombre: filtroNombre,
    estado: filtroEstado,
  });

  // Filtrar las rutas localmente
  const rutasFiltradas = todasLasRutas.filter((ruta) => {
    let cumpleNombre = true;
    let cumpleEstado = true;

    // Filtrar por nombre (busca en nombre, descripción e ID)
    if (filtroNombre) {
      const nombre = (ruta.nombre || "").toLowerCase();
      const descripcion = (ruta.descripcion || "").toLowerCase();
      const id = (ruta.id || "").toString().toLowerCase();

      cumpleNombre =
        nombre.includes(filtroNombre) ||
        descripcion.includes(filtroNombre) ||
        id.includes(filtroNombre);
    }

    // Filtrar por estado
    if (filtroEstado && filtroEstado !== "Todas") {
      cumpleEstado = ruta.estado === filtroEstado;
    }

    return cumpleNombre && cumpleEstado;
  });

  console.log(
    `Rutas filtradas: ${rutasFiltradas.length} de ${todasLasRutas.length}`
  );

  // Mostrar las rutas filtradas
  mostrarRutas(rutasFiltradas);
}

function limpiarFiltros() {
  const buscarInput = document.getElementById("filtroNombre");
  const estadoSelect = document.getElementById("filtroEstado");

  if (buscarInput) buscarInput.value = "";
  if (estadoSelect) estadoSelect.value = "Todas";

  // Mostrar todas las rutas
  mostrarRutas(todasLasRutas);
}

function configurarFiltros() {
  const buscarInput = document.getElementById("filtroNombre");
  const estadoSelect = document.getElementById("filtroEstado");
  const btnFiltrar = document.getElementById("btnFiltrar");

  // Validar que los elementos existan
  if (!buscarInput) {
    console.error("No se encontró el elemento 'filtroNombre'");
    return;
  }
  if (!estadoSelect) {
    console.error("No se encontró el elemento 'filtroEstado'");
    return;
  }
  if (!btnFiltrar) {
    console.error("No se encontró el elemento 'btnFiltrar'");
    return;
  }

  // Evento del botón filtrar
  btnFiltrar.addEventListener("click", aplicarFiltros);

  // Filtrar al presionar Enter en el campo de búsqueda
  buscarInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      aplicarFiltros();
    }
  });

  // Filtrar automáticamente cuando cambie el input de búsqueda (opcional)
  buscarInput.addEventListener("input", () => {
    // Aplicar filtros con un pequeño delay para evitar muchas llamadas
    clearTimeout(buscarInput.timeoutId);
    buscarInput.timeoutId = setTimeout(aplicarFiltros, 300);
  });

  // Filtrar automáticamente cuando cambie el select de estado
  estadoSelect.addEventListener("change", aplicarFiltros);
}
function editarRuta(id) {
  fetch(`/rutas/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener la ruta");
      }
      return response.json();
    })
    .then((ruta) => {
      // Validar que tenemos una ruta válida
      if (!ruta) {
        throw new Error("No se recibieron datos de la ruta");
      }

      // Mapeo de campos básicos
      setValueIfExists("nombreRuta", ruta.nombre);
      setValueIfExists("descripcionRuta", ruta.descripcion);
      setValueIfExists("estadoRuta", ruta.estado || "Activa");
      setValueIfExists(
        "fechaInicioRuta",
        formatDateForInput(ruta.fecha_inicio)
      );
      setValueIfExists("fechaFinRuta", formatDateForInput(ruta.fecha_fin));
      setValueIfExists("duracionRuta", ruta.duracion_estimada);
      setValueIfExists("kilometros", ruta.kilometros);
      setValueIfExists("tipoVehiculo", ruta.tipo_vehiculo || "Camion");
      setValueIfExists("numeroAutorizacion", ruta.numero_autorizacion);

      // Manejar horario (asumiendo formato "HH:MM - HH:MM")
      if (ruta.horario) {
        const [inicio, fin] = ruta.horario.split(" - ");
        setValueIfExists("horarioInicioRuta", inicio);
        setValueIfExists("horarioFinRuta", fin);
      }

      // Campos de origen
      setValueIfExists("latitudOrigen", ruta.latitud_origen);
      setValueIfExists("longitudOrigen", ruta.longitud_origen);
      setValueIfExists(
        "puntoConocidoOrigen",
        ruta.tipo_punto_origen || "Domicilio"
      );

      // Mostrar campos específicos según tipo de origen
      mostrarCamposOrigen();

      if (ruta.tipo_punto_origen === "Domicilio") {
        setValueIfExists("calleOrigen", ruta.origen_calle);
        setValueIfExists("numeroOrigen", ruta.origen_numero);
        setValueIfExists("coloniaOrigen", ruta.origen_colonia);
        setValueIfExists("cpOrigen", ruta.origen_cp);
      } else if (ruta.tipo_punto_origen === "Carretera") {
        setValueIfExists("carreteraOrigen", ruta.origen_carretera);
        setValueIfExists("kmOrigen", ruta.origen_kilometro);
      } else if (ruta.tipo_punto_origen === "Lugar") {
        setValueIfExists("descripcionOrigen", ruta.origen_descripcion);
      }

      // Campos de destino
      setValueIfExists("latitudDestino", ruta.latitud_destino);
      setValueIfExists("longitudDestino", ruta.longitud_destino);
      setValueIfExists(
        "puntoConocidoDestino",
        ruta.tipo_punto_destino || "Domicilio"
      );

      // Mostrar campos específicos según tipo de destino
      mostrarCamposDestino();

      if (ruta.tipo_punto_destino === "Domicilio") {
        setValueIfExists("calleDestino", ruta.destino_calle);
        setValueIfExists("numeroDestino", ruta.destino_numero);
        setValueIfExists("coloniaDestino", ruta.destino_colonia);
        setValueIfExists("cpDestino", ruta.destino_cp);
      } else if (ruta.tipo_punto_destino === "Carretera") {
        setValueIfExists("carreteraDestino", ruta.destino_carretera);
        setValueIfExists("kmDestino", ruta.destino_kilometro);
      } else if (ruta.tipo_punto_destino === "Lugar") {
        setValueIfExists("descripcionDestino", ruta.destino_descripcion);
      }

      // Establecer ID de la ruta en el formulario
      const form = document.getElementById("formAgregarRuta");
      if (form) {
        form.dataset.id = id;
      }

      // Cambiar título del modal
      const modalTitle = document.getElementById("addRouteModalLabel");
      if (modalTitle) {
        modalTitle.textContent = "Editar Ruta";
      }

      // Mostrar el modal
      const myModal = new bootstrap.Modal(
        document.getElementById("addRouteModal")
      );
      myModal.show();
    })
    .catch((error) => {
      console.error("Error al obtener la ruta:", error);
      alert("No se pudo cargar la ruta para editar: " + error.message);
    });
}

// Función auxiliar para establecer valores de forma segura
function setValueIfExists(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.value = value || "";
  } else {
    console.warn(`Elemento con ID ${elementId} no encontrado`);
  }
}

// Función auxiliar para formatear fechas para inputs date
function formatDateForInput(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch (e) {
    console.error("Error formateando fecha:", e);
    return "";
  }
}

async function agregarRuta() {
  const form = document.getElementById("formAgregarRuta");
  const token = localStorage.getItem("token");

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    alert("Por favor, complete todos los campos requeridos.");
    return;
  }

  // Obtener todos los valores del formulario
  const formData = {
    nombre: document.getElementById("nombreRuta").value.trim(),
    descripcion: document.getElementById("descripcionRuta").value.trim(),
    horario: `${document.getElementById("horarioInicioRuta").value} - ${
      document.getElementById("horarioFinRuta").value
    }`,
    estado: document.getElementById("estadoRuta").value,
    fecha_inicio: document.getElementById("fechaInicioRuta").value,
    fecha_fin: document.getElementById("fechaFinRuta").value,
    duracion_estimada: document.getElementById("duracionRuta").value.trim(),
    kilometros:
      parseFloat(document.getElementById("kilometros").value.trim()) || 0,
    tipo_vehiculo: document.getElementById("tipoVehiculo").value,
    numero_autorizacion: document
      .getElementById("numeroAutorizacion")
      .value.trim(),
    // Origen
    latitud_origen: parseFloat(
      document.getElementById("latitudOrigen").value.trim()
    ),
    longitud_origen: parseFloat(
      document.getElementById("longitudOrigen").value.trim()
    ),
    tipo_punto_origen: document.getElementById("puntoConocidoOrigen").value,
    // Destino
    latitud_destino: parseFloat(
      document.getElementById("latitudDestino").value.trim()
    ),
    longitud_destino: parseFloat(
      document.getElementById("longitudDestino").value.trim()
    ),
    tipo_punto_destino: document.getElementById("puntoConocidoDestino").value,
  };

  // Agregar campos específicos según tipo de punto de origen
  const tipoOrigen = formData.tipo_punto_origen;
  if (tipoOrigen === "Domicilio") {
    formData.origen_calle = document.getElementById("calleOrigen").value.trim();
    formData.origen_numero = document
      .getElementById("numeroOrigen")
      .value.trim();
    formData.origen_colonia = document
      .getElementById("coloniaOrigen")
      .value.trim();
    formData.origen_ciudad = document
      .getElementById("coloniaOrigen")
      .value.trim();
    formData.origen_cp = document.getElementById("cpOrigen").value.trim();
  } else if (tipoOrigen === "Carretera") {
    formData.origen_carretera = document
      .getElementById("carreteraOrigen")
      .value.trim();
    formData.origen_kilometro = document
      .getElementById("kmOrigen")
      .value.trim();
  } else if (tipoOrigen === "Lugar") {
    formData.origen_descripcion = document
      .getElementById("descripcionOrigen")
      .value.trim();
  }

  // Agregar campos específicos según tipo de punto de destino
  const tipoDestino = formData.tipo_punto_destino;
  if (tipoDestino === "Domicilio") {
    formData.destino_calle = document
      .getElementById("calleDestino")
      .value.trim();
    formData.destino_numero = document
      .getElementById("numeroDestino")
      .value.trim();
    formData.destino_colonia = document
      .getElementById("coloniaDestino")
      .value.trim();
    formData.destino_ciudad = document
      .getElementById("coloniaDestino")
      .value.trim();
    formData.destino_cp = document.getElementById("cpDestino").value.trim();
  } else if (tipoDestino === "Carretera") {
    formData.destino_carretera = document
      .getElementById("carreteraDestino")
      .value.trim();
    formData.destino_kilometro = document
      .getElementById("kmDestino")
      .value.trim();
  } else if (tipoDestino === "Lugar") {
    formData.destino_descripcion = document
      .getElementById("descripcionDestino")
      .value.trim();
  }

  // Validación de coordenadas
  if (isNaN(formData.latitud_origen) || isNaN(formData.longitud_origen)) {
    alert("Por favor ingrese coordenadas válidas para el origen.");
    return;
  }
  if (isNaN(formData.latitud_destino) || isNaN(formData.longitud_destino)) {
    alert("Por favor ingrese coordenadas válidas para el destino.");
    return;
  }

  try {
    const formId = form.dataset.id;
    const url = formId ? `/rutas/${formId}` : "/rutas/";
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
      formId ? "Ruta actualizada correctamente" : "Ruta creada correctamente"
    );

    // Cerrar el modal y recargar
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addRouteModal")
    );
    if (modal) modal.hide();

    cargarRutas();
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
  }
}
function eliminarRuta(id) {
  if (confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
    const token = localStorage.getItem("token");

    fetch(`/rutas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar la ruta");
        }
        return response.json();
      })
      .then(() => {
        alert("Ruta eliminada correctamente");
        // Recargar las rutas desde el servidor
        cargarRutas();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Ocurrió un error al eliminar la ruta");
      });
  }
}

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

function mostrarCamposOrigen() {
  const tipo = document.getElementById("puntoConocidoOrigen").value;

  // Ocultar todos los grupos primero
  document.getElementById("grupoDomicilioOrigen").style.display = "none";
  document.getElementById("grupoCarreteraOrigen").style.display = "none";
  document.getElementById("grupoLugarOrigen").style.display = "none";

  // Mostrar el grupo correspondiente
  if (tipo === "Domicilio") {
    document.getElementById("grupoDomicilioOrigen").style.display = "flex";
  } else if (tipo === "Carretera") {
    document.getElementById("grupoCarreteraOrigen").style.display = "flex";
  } else if (tipo === "Lugar") {
    document.getElementById("grupoLugarOrigen").style.display = "block";
  }
}

function mostrarCamposDestino() {
  const tipo = document.getElementById("puntoConocidoDestino").value;

  // Ocultar todos los grupos primero
  document.getElementById("grupoDomicilioDestino").style.display = "none";
  document.getElementById("grupoCarreteraDestino").style.display = "none";
  document.getElementById("grupoLugarDestino").style.display = "none";

  // Mostrar el grupo correspondiente
  if (tipo === "Domicilio") {
    document.getElementById("grupoDomicilioDestino").style.display = "flex";
  } else if (tipo === "Carretera") {
    document.getElementById("grupoCarreteraDestino").style.display = "flex";
  } else if (tipo === "Lugar") {
    document.getElementById("grupoLugarDestino").style.display = "block";
  }
}
