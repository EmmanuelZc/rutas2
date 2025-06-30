import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authControllers from "../controllers/authControllers.js"; // Importar los controladores de autenticación
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Rutas
router.post("/registro", authControllers.register);
router.post("/login", authControllers.login);
router.get("/admin", authControllers.adminDashboard);
router.get("/logout", authControllers.logout);
router.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.resolve("public", "admin-dashboard.html"));
});
router.get("/gestionarRutas", (req, res) => {
  res.sendFile(path.resolve("public", "gestionar-rutas.html"));
});

router.get("/gestionarParadas", (req, res) => {
  res.sendFile(path.resolve("public", "gestionar-paradas.html"));
});

router.get("/gestionarUsuarios", (req, res) => {
  res.sendFile(path.resolve("public", "gestionar-usuarios.html"));
});

export default router;
