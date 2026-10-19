import prisma from "../config/prisma.js";

function validarDadosFilme(body, parcial = false) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { erro: "O corpo da requisição deve ser um objeto JSON." };
    }

    const dados = {};
    const camposTexto = {
        titulo: 100,
        diretor: 100,
        genero: 50,
    };

    for (const [campo, limite] of Object.entries(camposTexto)) {
        const valor = body[campo];
        if (valor === undefined && parcial) continue;
        if (typeof valor !== "string" || valor.trim() === "") {
            return { erro: `O campo ${campo} é obrigatório e deve ser texto.` };
        }
        if (valor.trim().length > limite) {
            return { erro: `O campo ${campo} deve ter no máximo ${limite} caracteres.` };
        }
        dados[campo] = valor.trim();
    }

    if (body.ano !== undefined || !parcial) {
        const ano = typeof body.ano === "string" && /^\d+$/.test(body.ano.trim())
            ? Number(body.ano.trim())
            : body.ano;
        if (!Number.isSafeInteger(ano)) {
            return { erro: "O ano deve ser um número inteiro válido." };
        }
        dados.ano = ano;
    }

    return { dados };
}

function converterIdValido(idParametro) {
    if (!/^\d+$/.test(idParametro)) return null;
    const id = Number(idParametro);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function responderIdInvalido(res) {
    return res.status(400).json({ erro: "O ID do filme deve ser um inteiro positivo." });
}

function responderFilmeNaoEncontrado(res) {
    return res.status(404).json({ erro: "Filme não encontrado." });
}

export async function cadastrarFilme(req, res) {
    const validacao = validarDadosFilme(req.body);
    if (validacao.erro) return res.status(400).json({ erro: validacao.erro });

    const filme = await prisma.filme.create({ data: validacao.dados });
    return res.status(201).json(filme);
}

export async function listarFilmes(_req, res) {
    const filmes = await prisma.filme.findMany({ orderBy: { id: "asc" } });
    return res.json(filmes);
}

export async function buscarFilmePorId(req, res) {
    const id = converterIdValido(req.params.id);
    if (id === null) return responderIdInvalido(res);

    const filme = await prisma.filme.findUnique({ where: { id } });
    if (!filme) return responderFilmeNaoEncontrado(res);
    return res.json(filme);
}

export async function atualizarFilme(req, res) {
    const id = converterIdValido(req.params.id);
    if (id === null) return responderIdInvalido(res);

    const validacao = validarDadosFilme(req.body, true);
    if (validacao.erro) return res.status(400).json({ erro: validacao.erro });
    if (Object.keys(validacao.dados).length === 0) {
        return res.status(400).json({ erro: "Informe ao menos um campo para atualizar." });
    }

    try {
        const filme = await prisma.filme.update({ where: { id }, data: validacao.dados });
        return res.json(filme);
    } catch (erro) {
        if (erro.code === "P2025") return responderFilmeNaoEncontrado(res);
        throw erro;
    }
}

export async function excluirFilme(req, res) {
    const id = converterIdValido(req.params.id);
    if (id === null) return responderIdInvalido(res);

    try {
        const filme = await prisma.filme.delete({ where: { id } });
        return res.json({ mensagem: "Filme excluído com sucesso.", filme });
    } catch (erro) {
        if (erro.code === "P2025") return responderFilmeNaoEncontrado(res);
        throw erro;
    }
}
