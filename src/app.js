import express from "express";

import usuariosRoutes from "./routes/usuarios.js";
import filmesRoutes from "./routes/filmes.js";
import uploadRoutes from "./routes/upload.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const uploadsDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "uploads"
);

app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory));


// Rota inicial
app.get("/", (_req, res) => {

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

app.use((_req, res) => {
    res.status(404).json({ erro: "Rota não encontrada." });
});

app.use((erro, _req, res, _next) => {
    const statusInformado = erro.statusCode || erro.status;
    const status = Number.isInteger(statusInformado) &&
        statusInformado >= 400 && statusInformado < 600
        ? statusInformado
        : 500;

    if (status >= 500) {
        console.error(erro);
    }

    const erroJsonInvalido = erro.type === "entity.parse.failed";
    res.status(erroJsonInvalido ? 400 : status).json({
        erro: erroJsonInvalido
            ? "JSON inválido."
            : status >= 500
                ? "Erro interno do servidor."
                : erro.message
    });
});

export default app;