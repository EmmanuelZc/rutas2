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

router.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.resolve("public", "admin-dashboard.html"));
});

export default router;
