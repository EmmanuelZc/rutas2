import pool from "../config/config.js";
import bcrypt from "bcryptjs";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
// Función para registrar un usuario
export const registerUser = async (username, email, password, role) => {
  try {
    const emailExists = await pool.query(
      "SELECT * FROM Usuarios WHERE correo = $1",
      [email]
    );

    if (emailExists.rows.length > 0) {
      throw new Error("El correo electrónico ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const rol = await pool.query(
      "INSERT INTO Roles (nombre) VALUES ($1) RETURNING id",
      [role]
    );
    const usuario = await pool.query(
      "INSERT INTO Usuarios (nombre_usuario, correo, contrasena, rol_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, rol.rows[0].id]
    );

    return usuario.rows[0];
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    throw new Error(error.message || "Error al registrar usuario");
  }
};

export const iniciarSesion = async (email, password) => {
  try {
    const usuario = await pool.query(
      "SELECT * FROM Usuarios WHERE correo = $1",
      [email]
    );

    if (usuario.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      usuario.rows[0].contrasena
    );

    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    return usuario.rows[0];
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    throw new Error(error.message || "Error al iniciar sesión");
  }
};

export const obtenerRol = async (id_rol) => {
  const rol = await pool.query("SELECT nombre FROM Roles WHERE id = $1", [
    id_rol,
  ]);
  return rol.rows[0].nombre;
};
