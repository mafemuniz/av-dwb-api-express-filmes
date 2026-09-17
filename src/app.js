require("dotenv").config();

const express = require("express");

const usuariosRoutes = require("./routes/usuarios");
const filmesRoutes = require("./routes/filmes");
const uploadRoutes = require("./routes/upload");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
    res.json({
        mensagem: "API de Catálogo de Filmes funcionando!"
    });
});

app.use("/usuarios", usuariosRoutes);
app.use("/filmes", filmesRoutes);
app.use("/upload", uploadRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
});