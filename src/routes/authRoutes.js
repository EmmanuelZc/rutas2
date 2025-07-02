import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authControllers from "../controllers/authControllers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Rutas públicas
router.post("/registro", authControllers.register);
router.post("/login", authControllers.login);
router.get("/logout", authControllers.logout);

// Ruta para verificar rol (usada por checkUserRole)
router.get(
  "/verify-role",
  authControllers.authenticate,
  authControllers.verifyRole
);

// Rutas protegidas para dashboards
router.get(
  "/admin-dashboard",
  authControllers.authenticate,
  authControllers.authorize([authControllers.ROLES.ADMIN]),
  (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../../public", "admin-dashboard.html")
    );
  }
);
router.get(
  "/viewer-dashboard",
  authControllers.authenticate,
  authControllers.authorize([authControllers.ROLES.VIEWER]),
  (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../../public", "viewer-dashboard.html")
    );
  }
);

// Rutas protegidas para gestión (solo admin)
router.get(
  "/gestionarRutas",
  authControllers.authenticate,
  authControllers.authorize([authControllers.ROLES.ADMIN]),
  (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../../public", "gestionar-rutas.html")
    );
  }
);

router.get(
  "/gestionarParadas",
  authControllers.authenticate,
  authControllers.authorize([authControllers.ROLES.ADMIN]),
  (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../../public", "gestionar-paradas.html")
    );
  }
);

router.get(
  "/gestionarUsuarios",
  authControllers.authenticate,
  authControllers.authorize([authControllers.ROLES.ADMIN]),
  (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../../public", "gestionar-usuarios.html")
    );
  }
);

export default router;
