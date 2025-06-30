import {
  registerUser,
  iniciarSesion,
  obtenerRol,
} from "../models/autenticacionModel.js";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { resolve } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para manejar el registro
const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    const newUser = await registerUser(username, email, password, role);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.rol_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
    });
  } catch (error) {
    console.error("Error en el registro de usuario:", error.message);
    if (error.message === "El correo electrónico ya está registrado") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }

  try {
    // Verificar existencia del usuario y credenciales
    const user = await iniciarSesion(email, password);

    if (!user) {
      return res.status(401).json({ message: "Correo o contraseña inválidos" });
    }

    // Verificar que el usuario tenga rol asignado
    if (!user.rol_id) {
      return res.status(403).json({ message: "Usuario sin rol asignado" });
    }

    const nombreRol = await obtenerRol(user.rol_id);

    if (!nombreRol) {
      return res.status(403).json({ message: "Rol no válido" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: nombreRol },
      process.env.JWT_SECRET || "secret", // fallback por si no está definido
      { expiresIn: "1h" }
    );

    // Enviar cookie segura
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hora
    });

    // Respuesta final
    res.status(200).json({
      message: "Login exitoso",
      userId: user.id,
      role: nombreRol,
      token,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor durante el login" });
  }
};

const adminDashboard = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "Acceso no autorizado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }

    if (decodedToken.role !== "Administrador") {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Solo administradores." });
    }

    res.sendFile(resolve("public", "admin-dashboard.html"));
  });
};
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV != "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

export default {
  register,
  login,
  adminDashboard,
  logout,
};
