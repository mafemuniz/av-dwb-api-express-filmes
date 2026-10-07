import {
    filmes,
    gerarIdFilme
} from "../data/filmes.js";

export function cadastrarFilme(req, res) {

    const { titulo, diretor, ano, genero } = req.body;

    if (!titulo || !diretor || !ano || !genero) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const novoFilme = {
        id: gerarIdFilme(),
        titulo,
        diretor,
        ano,
        genero
    };

    filmes.push(novoFilme);

    res.status(201).json(novoFilme);
}


export function listarFilmes(req, res) {

    res.json(filmes);
}


export function buscarFilmePorId(req, res) {

    const id = Number(req.params.id);

    const filme = filmes.find(
        (filme) => filme.id === id
    );

    if (!filme) {
        return res.status(404).json({
            erro: "Filme não encontrado."
        });
    }

    res.json(filme);
}


export function atualizarFilme(req, res) {

    const id = Number(req.params.id);

    const filme = filmes.find(
        (filme) => filme.id === id
    );

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
}


export function excluirFilme(req, res) {

    const id = Number(req.params.id);

    const indice = filmes.findIndex(
        (filme) => filme.id === id
    );

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
}