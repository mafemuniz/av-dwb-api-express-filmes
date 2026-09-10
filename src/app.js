const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./docs/swagger");

const app = express();

const filmesRoutes = require("./routes/filmes");
const usuariosRoutes = require("./routes/usuarios");
const uploadRoutes = require("./routes/upload");

const PORT = 3000;

app.use(express.json());


// Página inicial
app.get("/", (req, res) => {
    res.json({
        mensagem: "API de Catálogo de Filmes funcionando!"
    });
});


// Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);


// Rotas
app.use("/filmes", filmesRoutes);

app.use("/usuarios", usuariosRoutes);

app.use("/upload", uploadRoutes);


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
});