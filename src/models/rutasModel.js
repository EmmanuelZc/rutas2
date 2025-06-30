import pool from "../config/config.js";

/* ─────────────────────────  SELECT  ───────────────────────── */
export const obtenerRutas = async () => {
  const { rows } = await pool.query("SELECT * FROM rutas");
  return rows;
};

export const obtenerRutaPorId = async (id) => {
  const { rows } = await pool.query("SELECT * FROM rutas WHERE id = $1", [id]);
  return rows[0];
};

export const obtenerRutaDetallada = async (id) => {
  const { rows } = await pool.query(
    `SELECT
        r.*,
        jsonb_build_object(
          'calle', uo.calle, 'numero', uo.numero, 'colonia', uo.colonia,
          'ciudad', uo.ciudad, 'cp', uo.codigo_postal,
          'latitud', uo.latitud, 'longitud', uo.longitud,
          'tipo_punto', uo.tipo_punto
        ) AS origen,
        jsonb_build_object(
          'calle', ud.calle, 'numero', ud.numero, 'colonia', ud.colonia,
          'ciudad', ud.ciudad, 'cp', ud.codigo_postal,
          'latitud', ud.latitud, 'longitud', ud.longitud,
          'tipo_punto', ud.tipo_punto
        ) AS destino
     FROM rutas r
     JOIN rutas_ubicaciones ru_o ON ru_o.ruta_id = r.id AND ru_o.tipo_origen_destino = 'origen'
     JOIN ubicaciones       uo   ON uo.id        = ru_o.ubicacion_id
     JOIN rutas_ubicaciones ru_d ON ru_d.ruta_id = r.id AND ru_d.tipo_origen_destino = 'destino'
     JOIN ubicaciones       ud   ON ud.id        = ru_d.ubicacion_id
    WHERE r.id = $1`,
    [id]
  );
  return rows[0];
};

/* ─────────────  INSERT: ruta + ubicaciones  ─────────────── */
export const crearRutaYUbicaciones = async (d) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    /* 1. Origen */
    const { rows: rowsO } = await client.query(
      `INSERT INTO ubicaciones
         (calle, numero, colonia, ciudad, codigo_postal,
          latitud, longitud, tipo_punto)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        d.origen_calle,
        d.origen_numero,
        d.origen_colonia,
        d.origen_ciudad,
        d.origen_cp,
        d.latitud_origen,
        d.longitud_origen,
        d.tipo_punto_origen,
      ]
    );

    /* 2. Destino */
    const { rows: rowsD } = await client.query(
      `INSERT INTO ubicaciones
         (calle, numero, colonia, ciudad, codigo_postal,
          latitud, longitud, tipo_punto)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        d.destino_calle,
        d.destino_numero,
        d.destino_colonia,
        d.destino_ciudad,
        d.destino_cp,
        d.latitud_destino,
        d.longitud_destino,
        d.tipo_punto_destino,
      ]
    );

    /* 3. Ruta */
    const { rows: rowsR } = await client.query(
      `INSERT INTO rutas
         (nombre, descripcion, horario, estado, usuario_id,
          fecha_inicio, fecha_fin, duracion_estimada, kilometros,
          tipo_vehiculo, numero_autorizacion)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        d.nombre,
        d.descripcion,
        d.horario,
        d.estado,
        d.usuario_id,
        d.fecha_inicio,
        d.fecha_fin,
        d.duracion_estimada,
        d.kilometros,
        d.tipo_vehiculo,
        d.numero_autorizacion,
      ]
    );

    /* 4. Tabla puente */
    await client.query(
      `INSERT INTO rutas_ubicaciones (ruta_id, ubicacion_id, tipo_origen_destino)
       VALUES ($1,$2,'origen'), ($1,$3,'destino')`,
      [rowsR[0].id, rowsO[0].id, rowsD[0].id]
    );

    await client.query("COMMIT");
    return rowsR[0];
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Error en crearRutaYUbicaciones:", e.message);
    throw e;
  } finally {
    client.release();
  }
};

/* ─────────────  UPDATE: ruta + ubicaciones  ─────────────── */
export const actualizarRutaYUbicaciones = async (rutaId, d) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    /* IDs de ubicaciones */
    const { rows } = await client.query(
      `SELECT ubicacion_id, tipo_origen_destino
         FROM rutas_ubicaciones
        WHERE ruta_id = $1`,
      [rutaId]
    );
    if (rows.length !== 2) throw new Error("La ruta no tiene 2 ubicaciones");

    const origenId = rows.find(
      (r) => r.tipo_origen_destino === "origen"
    ).ubicacion_id;
    const destinoId = rows.find(
      (r) => r.tipo_origen_destino === "destino"
    ).ubicacion_id;

    /* UPDATE origen */
    await client.query(
      `UPDATE ubicaciones
          SET calle=$1, numero=$2, colonia=$3, ciudad=$4, codigo_postal=$5,
              latitud=$6, longitud=$7, tipo_punto=$8
        WHERE id=$9`,
      [
        d.origen_calle,
        d.origen_numero,
        d.origen_colonia,
        d.origen_ciudad,
        d.origen_cp,
        d.latitud_origen,
        d.longitud_origen,
        d.tipo_punto_origen,
        origenId,
      ]
    );

    /* UPDATE destino */
    await client.query(
      `UPDATE ubicaciones
          SET calle=$1, numero=$2, colonia=$3, ciudad=$4, codigo_postal=$5,
              latitud=$6, longitud=$7, tipo_punto=$8
        WHERE id=$9`,
      [
        d.destino_calle,
        d.destino_numero,
        d.destino_colonia,
        d.destino_ciudad,
        d.destino_cp,
        d.latitud_destino,
        d.longitud_destino,
        d.tipo_punto_destino,
        destinoId,
      ]
    );

    /* UPDATE ruta */
    const { rows: rutaRows } = await client.query(
      `UPDATE rutas
          SET nombre=$1, descripcion=$2, horario=$3, estado=$4,
              fecha_inicio=$5, fecha_fin=$6,
              duracion_estimada=$7, kilometros=$8,
              tipo_vehiculo=$9, numero_autorizacion=$10
        WHERE id=$11
        RETURNING *`,
      [
        d.nombre,
        d.descripcion,
        d.horario,
        d.estado,
        d.fecha_inicio,
        d.fecha_fin,
        d.duracion_estimada,
        d.kilometros,
        d.tipo_vehiculo,
        d.numero_autorizacion,
        rutaId,
      ]
    );

    await client.query("COMMIT");
    return rutaRows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Error en actualizarRutaYUbicaciones:", e.message);
    throw e;
  } finally {
    client.release();
  }
};

/* ─────────────────────────  DELETE  ─────────────────────── */
export const eliminarRuta = async (id) => {
  await pool.query("DELETE FROM rutas WHERE id = $1", [id]);
};
