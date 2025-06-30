import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js"; // Asegúrate de que el archivo de rutas de autenticación sea correcto
import rutasRoutes from "./src/routes/rutasRoutes.js";
import paradasRoutes from "./src/routes/paradasRoutes.js"; // Asegúrate de que las rutas para paradas estén correctamente registradas
import testConnection from "./src/config/test.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Asegúrate de que express.json() está habilitado para procesar JSON
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/auth", authRoutes); // Asegúrate de que las rutas de autenticación estén correctamente configuradas
app.use("/rutas", rutasRoutes); // Asegúrate de que las rutas de rutas estén correctamente configuradas
app.use("/paradas", paradasRoutes); // Asegúrate de que las rutas de paradas estén correctamente configuradas

app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Error interno del servidor", error: err.message });
});
testConnection();
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
