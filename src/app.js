const express = require("express");

const app = express();

const filmesRoutes = require("./routes/filmes");

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "API de Catálogo de Filmes funcionando!"
    });
});

app.use("/filmes", filmesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
});