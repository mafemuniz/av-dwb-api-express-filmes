const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

let usuarios = [];

let proximoId = 1;


// ==========================================
// CADASTRAR USUÁRIO
// POST /usuarios
// ==========================================

router.post("/", async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, email e senha são obrigatórios."
            });
        }

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
            id: proximoId,
            nome: nome,
            email: email,
            senha: senhaCriptografada
        };

        usuarios.push(novoUsuario);

        proximoId++;

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

});


// ==========================================
// LOGIN
// POST /usuarios/login
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios."
            });
        }

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

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            mensagem: "Login realizado com sucesso.",
            token: token
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao realizar login."
        });

    }

});


module.exports = router;