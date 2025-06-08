import {
  registerUser,
  iniciarSesion,
  obtenerRol,
} from "../models/autenticacionModel.js";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

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

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }

  try {
    const user = await iniciarSesion(email, password);
    const nombreRol = await obtenerRol(user.rol_id);
    // Generar el token JWT con el ID del rol
    const token = jwt.sign(
      { id: user.id, role: nombreRol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en el login de usuario:", error);
    res
      .status(401)
      .json({ message: "Correo electrónico o contraseña incorrectos" });
  }
};
const adminDashboard = (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Acceso no autorizado" });
  }

  const tokenWithoutBearer = token.replace("Bearer ", "");

  jwt.verify(
    tokenWithoutBearer,
    process.env.JWT_SECRET,
    (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido o expirado" });
      }

      if (decodedToken.role !== "Administrador") {
        return res
          .status(403)
          .json({ message: "Acceso denegado. Solo administradores." });
      }

      res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
    }
  );
};

export default {
  register,
  login,
  adminDashboard,
};
