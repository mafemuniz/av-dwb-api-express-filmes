import express from "express";

import usuariosRoutes from "./routes/usuarios.js";
import filmesRoutes from "./routes/filmes.js";
import uploadRoutes from "./routes/upload.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

const app = express();

app.use(express.json());


// Rota inicial
app.get("/", (req, res) => {

    res.json({
        mensagem: "API de Catálogo de Filmes funcionando!"
    });

});


// Rotas
app.use("/usuarios", usuariosRoutes);
app.use("/filmes", filmesRoutes);
app.use("/upload", uploadRoutes);


// Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

export default app;