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

// Roles del sistema (centralizado para fácil mantenimiento)
const ROLES = {
  ADMIN: "Administrador",
  VIEWER: "Visualizador",
};

// Configuración de tokens
const TOKEN_CONFIG = {
  expiresIn: "1h",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600000, // 1 hora
  },
};

// Función para manejar el registro
const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validación mejorada
  if (!username || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Todos los campos son requeridos",
      requiredFields: ["username", "email", "password", "role"],
    });
  }

  // Validar que el rol sea uno de los permitidos
  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Rol no válido",
      validRoles: Object.values(ROLES),
    });
  }

  try {
    const newUser = await registerUser(username, email, password, role);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.rol_id },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_CONFIG.expiresIn }
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.rol_id,
      },
    });
  } catch (error) {
    console.error("Error en el registro de usuario:", error.message);

    const statusCode =
      error.message === "El correo electrónico ya está registrado" ? 400 : 500;
    const errorMessage =
      statusCode === 400 ? error.message : "Error interno del servidor";

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Función para manejar el inicio de sesión
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validación mejorada
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email y contraseña son requeridos",
      requiredFields: ["email", "password"],
    });
  }

  try {
    const user = await iniciarSesion(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    const nombreRol = await obtenerRol(user.rol_id);

    if (!nombreRol) {
      return res.status(403).json({
        success: false,
        message: "Rol no válido asignado al usuario",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: nombreRol },
      process.env.JWT_SECRET || "secret_default_para_desarrollo",
      { expiresIn: TOKEN_CONFIG.expiresIn }
    );

    // Configurar cookie segura
    res.cookie("token", token, TOKEN_CONFIG.cookieOptions);

    // Respuesta estructurada
    res.status(200).json({
      success: true,
      message: "Autenticación exitosa",
      data: {
        userId: user.id,
        role: nombreRol,
        token,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor durante el login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Middleware para verificar autenticación
const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Acceso no autorizado - Token no proporcionado",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }

    req.user = decoded;
    next();
  });
};

// Middleware para verificar roles
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Rol requerido: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

// Controlador para dashboards
const serveDashboard = (req, res) => {
  const { role } = req.user;
  const dashboardMap = {
    [ROLES.ADMIN]: "admin-dashboard.html",
    [ROLES.VIEWER]: "viewer-dashboard.html",
  };

  const dashboardFile = dashboardMap[role];

  if (!dashboardFile) {
    return res.status(403).json({
      success: false,
      message: "Rol no autorizado para acceder a ningún dashboard",
    });
  }

  res.sendFile(resolve(__dirname, "../public", dashboardFile));
};

// Función para cerrar sesión
const logout = (req, res) => {
  res.clearCookie("token", TOKEN_CONFIG.cookieOptions);
  res.status(200).json({
    success: true,
    message: "Sesión cerrada exitosamente",
  });
};

// Función para verificar rol (para el frontend)
const verifyRole = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No autenticado",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token inválido",
      });
    }

    res.status(200).json({
      success: true,
      role: decoded.role,
      userId: decoded.id,
    });
  });
};

export default {
  register,
  login,
  logout,
  authenticate,
  authorize,
  serveDashboard,
  verifyRole,
  ROLES,
};
