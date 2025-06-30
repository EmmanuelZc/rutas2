import pool from "../config/config.js";

export const crearParada = async (data) => {
  const query = `
    INSERT INTO paradas (
      nombre, ubicacion_id, orden, ruta_id, tipo_transporte, 
      capacidad_maxima, acceso_discapacitados, area_descanso,
      servicios_adicionales, contacto_parada, zona_peatonal,
      descripcion_detallada, horario_apertura, horario_cierre
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `;

  const values = [
    data.nombre,
    data.ubicacion_id,
    data.orden,
    data.ruta_id,
    data.tipo_transporte || null,
    data.capacidad_maxima || null,
    data.acceso_discapacitados || false,
    data.area_descanso || false,
    data.servicios_adicionales || null,
    data.contacto_parada || null,
    data.zona_peatonal || false,
    data.descripcion_detallada || null,
    data.horario_apertura || null,
    data.horario_cierre || null,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error en crearParada:", error);
    throw error;
  }
};

// Obtener todas las paradas con información de ubicación
export const obtenerParadas = async () => {
  const query = `
    SELECT 
      p.*, 
      u.calle, 
      u.ciudad, 
      u.latitud, 
      u.longitud, 
      u.tipo_punto,
      r.nombre as ruta_nombre
    FROM paradas p
    LEFT JOIN ubicaciones u ON p.ubicacion_id = u.id
    LEFT JOIN rutas r ON p.ruta_id = r.id
    ORDER BY p.orden
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error en obtenerParadas:", error);
    throw error;
  }
};

// Obtener una parada por ID con información de ubicación
export const obtenerParadaPorId = async (id) => {
  const query = `
    SELECT 
      p.*, 
      u.calle, 
      u.ciudad, 
      u.latitud, 
      u.longitud, 
      u.tipo_punto
    FROM paradas p
    LEFT JOIN ubicaciones u ON p.ubicacion_id = u.id
    WHERE p.id = $1
  `;

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error en obtenerParadaPorId:", error);
    throw error;
  }
};

// Eliminar una parada
export const eliminarParada = async (id) => {
  const query = "DELETE FROM paradas WHERE id = $1 RETURNING *";

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error en eliminarParada:", error);
    throw error;
  }
};

// Eliminar una ubicación
export const eliminarUbicacion = async (id) => {
  const result = await pool.query(
    "DELETE FROM ubicaciones WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export const crearUbicacion = async ({
  calle,
  ciudad,
  latitud,
  longitud,
  tipo_punto,
}) => {
  const query = `
    INSERT INTO ubicaciones (calle, ciudad, latitud, longitud, tipo_punto)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const values = [calle, ciudad, latitud, longitud, tipo_punto];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Devuelve la ubicación creada con su id
  } catch (error) {
    console.error("Error al crear la ubicación:", error);
    throw error;
  }
};
