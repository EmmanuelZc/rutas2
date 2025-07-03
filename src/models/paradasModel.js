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

export const obtenerParadaPorId = async (id) => {
  const query = `
    SELECT 
      p.*, 
      u.calle, 
      u.numero,
      u.colonia,
      u.codigo_postal,
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
export const contarParadas = async () => {
  const { rows } = await pool.query("SELECT COUNT(*) AS total FROM paradas");
  return parseInt(rows[0].total, 10);
};

export const actualizarUbicacion = async (
  ubicacion_id,
  { calle, ciudad, latitud, longitud, tipo_punto }
) => {
  try {
    const query = `
      UPDATE ubicaciones
      SET
        calle = $1,
        ciudad = $2,
        latitud = $3,
        longitud = $4,
        tipo_punto = $5
      WHERE id = $6
      RETURNING *;`; // La cláusula RETURNING nos permite devolver la ubicación actualizada

    const values = [calle, ciudad, latitud, longitud, tipo_punto, ubicacion_id];

    // Ejecutamos la consulta de actualización
    const { rows } = await pool.query(query, values);

    // Si no se encontró la ubicación, lanzamos un error
    if (rows.length === 0) {
      throw new Error("Ubicación no encontrada");
    }

    // Devolvemos la ubicación actualizada
    return rows[0];
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    throw error; // Propagamos el error
  }
};

export const actualizarParada = async (
  id,
  {
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
  }
) => {
  try {
    // Consulta SQL para actualizar la parada
    const query = `
      UPDATE paradas
      SET
        nombre = $1,
        ubicacion_id = $2,
        orden = $3,
        ruta_id = $4,
        tipo_transporte = $5,
        capacidad_maxima = $6,
        acceso_discapacitados = $7,
        area_descanso = $8,
        servicios_adicionales = $9,
        contacto_parada = $10,
        zona_peatonal = $11,
        descripcion_detallada = $12,
        horario_apertura = $13,
        horario_cierre = $14
      WHERE id = $15
      RETURNING *;
    `;

    // Los valores que se van a pasar en la consulta
    const values = [
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
      id, // id de la parada que se va a actualizar
    ];

    // Ejecutar la consulta
    const { rows } = await pool.query(query, values);

    // Si no se encontró la parada, lanzamos un error
    if (rows.length === 0) {
      return null;
    }

    // Devolvemos la parada actualizada
    return rows[0]; // Retorna el primer elemento (que es el único ya que id es único)
  } catch (error) {
    console.error("Error al actualizar la parada:", error);
    throw error; // Lanza el error para ser manejado en el controlador
  }
};
