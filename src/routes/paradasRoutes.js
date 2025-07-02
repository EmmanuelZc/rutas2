// routes/paradasRoutes.js
import express from "express";
import * as paradasController from "../controllers/paradasControllers.js"; // Asegúrate de que el controlador esté correctamente importado

const router = express.Router();

// Aquí estamos pasando las funciones del controlador como manejadores de rutas
router.post("/", paradasController.crearParadaController);
router.get("/", paradasController.obtenerParadasController);
router.get("/:id", paradasController.obtenerParadaPorIdController);
router.put("/:id", paradasController.actualizarParadaController);
router.delete("/:id", paradasController.eliminarParadaController);

router.get("/count", paradasController.contarParadasController);

export default router;
