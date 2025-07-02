import express from "express";
import * as rutasController from "../controllers/rutasControllers.js";
import { verificarToken } from "../../middleware/verficarInicio.js";

const router = express.Router();

router.get("/", rutasController.getRutas);
router.get("/count", rutasController.contarRutasController); // MOVER ESTA RUTA ARRIBA DE /:id
router.get("/:id", rutasController.getRuta);
router.post("/", rutasController.postRuta);
router.put("/:id", rutasController.putRuta);
router.delete("/:id", verificarToken, rutasController.deleteRuta);

export default router;
