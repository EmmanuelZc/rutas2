import * as UbicacionesModel from "../models/paradasModel.js";

// Crear una nueva parada
// Crear una nueva parada
export const crearParadaController = async (req, res) => {
  try {
    const {
      nombre,
      orden,
      ruta_id,
      tipo_transporte,
      capacidad_maxima,
      acceso_discapacitados,
      area_descanso,
      servicios_adicionales,
      contacto_parada,
      zona_peatonal,
      descripcion_detallada,
      horario_apertura,
      horario_cierre,
      // Datos de ubicación
      calle,
      ciudad,
      latitud,
      longitud,
      tipo_punto,
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !orden || !ruta_id) {
      return res.status(400).json({
        message: "El nombre, orden y ruta_id son requeridos",
      });
    }

    // Crear ubicación primero si se proporcionan datos
    let ubicacion_id = null;
    if (latitud && longitud) {
      const ubicacion = await UbicacionesModel.crearUbicacion({
        calle,
        ciudad,
        latitud,
        longitud,
        tipo_punto: tipo_punto || "Domicilio",
      });
      ubicacion_id = ubicacion.id;
    }

    // Crear la parada
    const nuevaParada = await UbicacionesModel.crearParada({
      nombre,
      ubicacion_id,
      orden,
      ruta_id,
      tipo_transporte,
      capacidad_maxima,
      acceso_discapacitados,
      area_descanso,
      servicios_adicionales,
      contacto_parada,
      zona_peatonal,
      descripcion_detallada,
      horario_apertura,
      horario_cierre,
    });

    res.status(201).json(nuevaParada);
  } catch (error) {
    console.error("Error al crear la parada:", error);
    res.status(500).json({
      message: "Error al crear la parada",
      error: error.message,
    });
  }
};

// Obtener todas las paradas
export const obtenerParadasController = async (req, res) => {
  try {
    const paradas = await UbicacionesModel.obtenerParadas();
    res.status(200).json(paradas);
  } catch (error) {
    console.error("Error al obtener las paradas:", error);
    res.status(500).json({
      message: "Error al obtener las paradas",
      error: error.message,
    });
  }
};
// Obtener una parada por ID - Versión corregida
export const obtenerParadaPorIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Asegúrate de que el ID sea un número
    const paradaId = parseInt(id);
    if (isNaN(paradaId)) {
      return res.status(400).json({ message: "ID de parada no válido" });
    }

    const parada = await UbicacionesModel.obtenerParadaPorId(paradaId);

    if (!parada) {
      return res.status(404).json({ message: "Parada no encontrada" });
    }

    res.status(200).json(parada);
  } catch (error) {
    console.error("Error al obtener la parada:", error);
    res.status(500).json({
      message: "Error al obtener la parada",
      error: error.message,
    });
  }
};

// Actualizar una parada
export const actualizarParadaController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      orden,
      ruta_id,
      tipo_transporte,
      capacidad_maxima,
      acceso_discapacitados,
      area_descanso,
      servicios_adicionales,
      contacto_parada,
      zona_peatonal,
      descripcion_detallada,
      horario_apertura,
      horario_cierre,
      // Datos de ubicación
      calle,
      ciudad,
      latitud,
      longitud,
      tipo_punto,
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !orden) {
      return res.status(400).json({
        message: "El nombre y el orden son requeridos",
      });
    }

    // Obtener parada actual para ver si tiene ubicación
    const paradaActual = await UbicacionesModel.obtenerParadaPorId(id);
    let ubicacion_id = paradaActual.ubicacion_id;

    // Actualizar o crear ubicación
    if (latitud && longitud) {
      if (ubicacion_id) {
        await UbicacionesModel.actualizarUbicacion(ubicacion_id, {
          calle,
          ciudad,
          latitud,
          longitud,
          tipo_punto: tipo_punto || "Domicilio",
        });
      } else {
        const ubicacion = await UbicacionesModel.crearUbicacion({
          calle,
          ciudad,
          latitud,
          longitud,
          tipo_punto: tipo_punto || "Domicilio",
        });
        ubicacion_id = ubicacion.id;
      }
    }

    // Actualizar la parada
    const paradaActualizada = await UbicacionesModel.actualizarParada(id, {
      nombre,
      ubicacion_id,
      orden,
      ruta_id,
      tipo_transporte,
      capacidad_maxima,
      acceso_discapacitados,
      area_descanso,
      servicios_adicionales,
      contacto_parada,
      zona_peatonal,
      descripcion_detallada,
      horario_apertura,
      horario_cierre,
    });

    if (!paradaActualizada) {
      return res.status(404).json({ message: "Parada no encontrada" });
    }

    res.status(200).json(paradaActualizada);
  } catch (error) {
    console.error("Error al actualizar la parada:", error);
    res.status(500).json({
      message: "Error al actualizar la parada",
      error: error.message,
    });
  }
};

// Eliminar una parada
export const eliminarParadaController = async (req, res) => {
  try {
    const { id } = req.params;
    const paradaEliminada = await UbicacionesModel.eliminarParada(id);

    if (!paradaEliminada) {
      return res.status(404).json({ message: "Parada no encontrada" });
    }

    // Opcional: Eliminar también la ubicación asociada si existe
    if (paradaEliminada.ubicacion_id) {
      await UbicacionesModel.eliminarUbicacion(paradaEliminada.ubicacion_id);
    }

    res.status(200).json({
      message: "Parada eliminada correctamente",
      parada: paradaEliminada,
    });
  } catch (error) {
    console.error("Error al eliminar la parada:", error);
    res.status(500).json({
      message: "Error al eliminar la parada",
      error: error.message,
    });
  }
};

export const contarParadasController = async (req, res) => {
  try {
    const count = await UbicacionesModel.contarParadas();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error("Error al contar las paradas:", error);
    res.status(500).json({
      message: "Error al contar las paradas",
      error: error.message,
    });
  }
};
