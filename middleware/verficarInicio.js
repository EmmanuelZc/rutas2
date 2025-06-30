// src/middleware/verficarInicio.js

import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No autorizado: token faltante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("Token inválido:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
