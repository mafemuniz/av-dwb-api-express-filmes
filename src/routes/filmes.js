const express = require("express");

const router = express.Router();

let filmes = [];

let proximoId = 1;

// POST /filmes
router.post("/", (req, res) => {
    const { titulo, diretor, ano, genero } = req.body;

    if (!titulo || !diretor || !ano || !genero) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const novoFilme = {
        id: proximoId,
        titulo,
        diretor,
        ano,
        genero
    };

    filmes.push(novoFilme);

    proximoId++;

    res.status(201).json(novoFilme);
});


// GET /filmes
router.get("/", (req, res) => {
    res.json(filmes);
});


// GET /filmes/:id
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    const filme = filmes.find((filme) => filme.id === id);

    if (!filme) {
        return res.status(404).json({
            erro: "Filme não encontrado."
        });
    }

    res.json(filme);
});


// PUT /filmes/:id
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);

    const filme = filmes.find((filme) => filme.id === id);

    if (!filme) {
        return res.status(404).json({
            erro: "Filme não encontrado."
        });
    }

    const { titulo, diretor, ano, genero } = req.body;

    if (!titulo || !diretor || !ano || !genero) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    filme.titulo = titulo;
    filme.diretor = diretor;
    filme.ano = ano;
    filme.genero = genero;

    res.json(filme);
});


// DELETE /filmes/:id
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    const indice = filmes.findIndex((filme) => filme.id === id);

    if (indice === -1) {
        return res.status(404).json({
            erro: "Filme não encontrado."
        });
    }

    const filmeRemovido = filmes.splice(indice, 1);

    res.json({
        mensagem: "Filme excluído com sucesso.",
        filme: filmeRemovido[0]
    });
});


module.exports = router;