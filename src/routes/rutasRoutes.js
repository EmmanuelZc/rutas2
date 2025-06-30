import express from "express";
import * as rutasController from "../controllers/rutasControllers.js";
import { verificarToken } from "../../middleware/verficarInicio.js"; // ruta correcta

const router = express.Router();

router.get("/", rutasController.getRutas);
router.get("/:id", rutasController.getRuta);
router.post("/", rutasController.postRuta);
router.put("/:id", rutasController.putRuta);
router.delete("/:id", verificarToken, rutasController.deleteRuta);

export default router;
