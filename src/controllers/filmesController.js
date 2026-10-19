import {
    filmes,
    gerarIdFilme
} from "../data/filmes.js";

function validarDadosFilme(body) {
    const { titulo, diretor, ano, genero } =
        body && typeof body === "object" ? body : {};

    const camposTextoValidos = [titulo, diretor, genero].every(
        (valor) => typeof valor === "string" && valor.trim() !== ""
    );

    if (
        !camposTextoValidos ||
        ano === undefined ||
        ano === null ||
        (typeof ano === "string" && ano.trim() === "")
    ) {
        return {
            erro: "Todos os campos são obrigatórios."
        };
    }

    if (typeof ano !== "number" && typeof ano !== "string") {
        return {
            erro: "O ano deve ser um número inteiro válido."
        };
    }

    if (typeof ano === "string" && !/^[+-]?\d+$/.test(ano.trim())) {
        return {
            erro: "O ano deve ser um número inteiro válido."
        };
    }

    const anoNumerico = Number(ano);

    if (!Number.isSafeInteger(anoNumerico)) {
        return {
            erro: "O ano deve ser um número inteiro válido."
        };
    }

    return {
        dados: {
            titulo,
            diretor,
            ano: anoNumerico,
            genero
        }
    };
}

function converterIdValido(idParametro) {
    if (!/^\d+$/.test(idParametro)) {
        return null;
    }

    const id = Number(idParametro);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function responderFilmeNaoEncontrado(res) {
    return res.status(404).json({
        erro: "Filme não encontrado."
    });
}

function responderIdInvalido(res) {
    return res.status(400).json({
        erro: "O ID do filme deve ser um inteiro positivo."
    });
}

export function cadastrarFilme(req, res) {

    const validacao = validarDadosFilme(req.body);

    if (validacao.erro) {
        return res.status(400).json({ erro: validacao.erro });
    }

    const novoFilme = {
        id: gerarIdFilme(),
        ...validacao.dados
    };

    filmes.push(novoFilme);

    res.status(201).json(novoFilme);
}


export function listarFilmes(req, res) {

    res.json(filmes);
}


export function buscarFilmePorId(req, res) {

    const id = converterIdValido(req.params.id);

    if (id === null) {
        return responderIdInvalido(res);
    }

    const filme = filmes.find(
        (filme) => filme.id === id
    );

    if (!filme) {
        return responderFilmeNaoEncontrado(res);
    }

    res.json(filme);
}


export function atualizarFilme(req, res) {

    const id = converterIdValido(req.params.id);

    if (id === null) {
        return responderIdInvalido(res);
    }

    const filme = filmes.find(
        (filme) => filme.id === id
    );

    if (!filme) {
        return responderFilmeNaoEncontrado(res);
    }

    const validacao = validarDadosFilme(req.body);

    if (validacao.erro) {
        return res.status(400).json({ erro: validacao.erro });
    }

    Object.assign(filme, validacao.dados);

    res.json(filme);
}


export function excluirFilme(req, res) {

    const id = converterIdValido(req.params.id);

    if (id === null) {
        return responderIdInvalido(res);
    }

    const indice = filmes.findIndex(
        (filme) => filme.id === id
    );

    if (indice === -1) {
        return responderFilmeNaoEncontrado(res);
    }

    const filmeRemovido = filmes.splice(indice, 1);

    res.json({
        mensagem: "Filme excluído com sucesso.",
        filme: filmeRemovido[0]
    });
}