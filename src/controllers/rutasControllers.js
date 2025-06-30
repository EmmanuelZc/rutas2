import * as RutasModel from "../models/rutasModel.js";

export const getRutas = async (req, res) => {
  const rutas = await RutasModel.obtenerRutas();
  res.json(rutas);
};

export const getRuta = async (req, res) => {
  try {
    const ruta = await RutasModel.obtenerRutaDetallada(req.params.id);
    if (!ruta) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }

    // Transformar la estructura para el frontend
    const rutaFormateada = {
      id: ruta.id,
      nombre: ruta.nombre,
      descripcion: ruta.descripcion,
      horario: ruta.horario,
      estado: ruta.estado,
      fecha_inicio: ruta.fecha_inicio,
      fecha_fin: ruta.fecha_fin,
      duracion_estimada: ruta.duracion_estimada,
      kilometros: ruta.kilometros,
      tipo_vehiculo: ruta.tipo_vehiculo,
      numero_autorizacion: ruta.numero_autorizacion,
      // Origen
      latitud_origen: ruta.origen.latitud,
      longitud_origen: ruta.origen.longitud,
      tipo_punto_origen: ruta.origen.tipo_punto,
      origen_calle: ruta.origen.calle,
      origen_numero: ruta.origen.numero,
      origen_colonia: ruta.origen.colonia,
      origen_ciudad: ruta.origen.ciudad,
      origen_cp: ruta.origen.cp,
      origen_carretera: ruta.origen.calle, // Para tipo Carretera
      origen_kilometro: ruta.origen.numero, // Para tipo Carretera
      origen_descripcion: ruta.origen.calle, // Para tipo Lugar
      // Destino
      latitud_destino: ruta.destino.latitud,
      longitud_destino: ruta.destino.longitud,
      tipo_punto_destino: ruta.destino.tipo_punto,
      destino_calle: ruta.destino.calle,
      destino_numero: ruta.destino.numero,
      destino_colonia: ruta.destino.colonia,
      destino_ciudad: ruta.destino.ciudad,
      destino_cp: ruta.destino.cp,
      destino_carretera: ruta.destino.calle, // Para tipo Carretera
      destino_kilometro: ruta.destino.numero, // Para tipo Carretera
      destino_descripcion: ruta.destino.calle, // Para tipo Lugar
    };

    res.json(rutaFormateada);
  } catch (error) {
    console.error("Error al obtener ruta:", error);
    res.status(500).json({ message: "Error al obtener la ruta" });
  }
};
export const postRuta = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      horario,
      estado,
      fecha_inicio,
      fecha_fin,
      duracion_estimada,
      kilometros,
      tipo_vehiculo,
      numero_autorizacion,
      origen_calle,
      origen_ciudad,
      latitud_origen,
      longitud_origen,
      tipo_punto_origen,
      destino_calle,
      destino_ciudad,
      latitud_destino,
      longitud_destino,
      tipo_punto_destino,
    } = req.body;

    if (
      !nombre ||
      !estado ||
      !latitud_origen ||
      !longitud_origen ||
      !latitud_destino ||
      !longitud_destino
    )
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const nuevaRuta = await RutasModel.crearRutaYUbicaciones({
      nombre,
      descripcion,
      horario,
      estado,

      fecha_inicio,
      fecha_fin,
      duracion_estimada,
      kilometros,
      tipo_vehiculo,
      numero_autorizacion,
      origen_calle,
      origen_ciudad,
      latitud_origen,
      longitud_origen,
      tipo_punto_origen,
      destino_calle,
      destino_ciudad,
      latitud_destino,
      longitud_destino,
      tipo_punto_destino,
    });

    res.status(201).json({ message: "Ruta creada exitosamente", nuevaRuta });
  } catch (error) {
    console.error("Error al crear ruta:", error.message);
    res.status(500).json({ message: "Error al registrar ruta" });
  }
};

export const putRuta = async (req, res) => {
  try {
    // ── 1. Datos del body ───────────────────────────────────────────────
    const {
      nombre,
      descripcion,
      horario,
      estado,
      fecha_inicio,
      fecha_fin,
      duracion_estimada,
      kilometros,
      tipo_vehiculo,
      numero_autorizacion,

      // Origen
      origen_calle,
      origen_ciudad,
      origen_colonia,
      origen_cp,
      origen_numero,
      latitud_origen,
      longitud_origen,
      tipo_punto_origen,

      // Destino
      destino_calle,
      destino_ciudad,
      destino_colonia,
      destino_cp,
      destino_numero,
      latitud_destino,
      longitud_destino,
      tipo_punto_destino,
    } = req.body;

    // ── 2. Validaciones rápidas ─────────────────────────────────────────
    if (
      !nombre ||
      !estado ||
      !latitud_origen ||
      !longitud_origen ||
      !latitud_destino ||
      !longitud_destino
    ) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // ── 3. Actualizar ───────────────────────────────────────────────────
    const rutaActualizada = await RutasModel.actualizarRutaYUbicaciones(
      req.params.id,
      {
        nombre,
        descripcion,
        horario,
        estado,

        fecha_inicio,
        fecha_fin,
        duracion_estimada,
        kilometros,
        tipo_vehiculo,
        numero_autorizacion,
        origen_calle,
        origen_ciudad,
        origen_colonia,
        origen_cp,
        origen_numero,
        latitud_origen,
        longitud_origen,
        tipo_punto_origen,
        destino_calle,
        destino_ciudad,
        destino_colonia,
        destino_cp,
        destino_numero,
        latitud_destino,
        longitud_destino,
        tipo_punto_destino,
      }
    );

    if (!rutaActualizada) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }

    res.json({
      message: "Ruta actualizada exitosamente",
      rutaActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar la ruta:", error.message);
    res.status(500).json({
      message: "Error al actualizar la ruta",
      error: error.message,
    });
  }
};

export const deleteRuta = async (req, res) => {
  await RutasModel.eliminarRuta(req.params.id);
  res.json({ message: "Ruta eliminada" });
};
