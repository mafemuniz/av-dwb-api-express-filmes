import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    usuarios,
    gerarIdUsuario
} from "../data/usuarios.js";

function obterDadosUsuario(body, exigirNome = true) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return null;
    }

    const { nome, email, senha } = body;

    if (
        (exigirNome && (typeof nome !== "string" || nome.trim() === "")) ||
        typeof email !== "string" || email.trim() === "" ||
        typeof senha !== "string" || senha.trim() === ""
    ) {
        return null;
    }

    return {
        nome: typeof nome === "string" ? nome.trim() : undefined,
        email: email.trim().toLowerCase(),
        senha
    };
}

export async function cadastrarUsuario(req, res) {

    try {

        const dadosUsuario = obterDadosUsuario(req.body);

        if (!dadosUsuario) {
            return res.status(400).json({
                erro: "Nome, email e senha são obrigatórios."
            });
        }

        const { nome, email, senha } = dadosUsuario;

        const usuarioExistente = usuarios.find(
            (usuario) => usuario.email === email
        );

        if (usuarioExistente) {
            return res.status(409).json({
                erro: "Este email já está cadastrado."
            });
        }

        const senhaCriptografada =
            await bcrypt.hash(senha, 10);

        const novoUsuario = {
            id: gerarIdUsuario(),
            nome,
            email,
            senha: senhaCriptografada
        };

        usuarios.push(novoUsuario);

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso.",
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            }
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao cadastrar usuário."
        });
    }
}


export async function loginUsuario(req, res) {

    try {

        const dadosUsuario = obterDadosUsuario(req.body, false);

        if (!dadosUsuario) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios."
            });
        }

        const { email, senha } = dadosUsuario;

        const usuario = usuarios.find(
            (usuario) => usuario.email === email
        );

        if (!usuario) {
            return res.status(401).json({
                erro: "Email ou senha incorretos."
            });
        }

        const senhaCorreta =
            await bcrypt.compare(
                senha,
                usuario.senha
            );

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: "Email ou senha incorretos."
            });
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret?.trim()) {
            return res.status(500).json({
                erro: "Erro interno de autenticação."
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            jwtSecret,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            mensagem: "Login realizado com sucesso.",
            token
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao realizar login."
        });
    }
}