import * as usuariosModel from "../models/usuariosModel.js";
import jwt from "jsonwebtoken";

import { usuarios, gerarIdUsuario } from "../data/usuarios.js";

export async function listarUsuarios(req, res) {
  const usuarios = await usuariosModel.listarUsuarios();

  res.json(usuarios);
}

export function buscarUsuario(req, res) {
  const id = Number(req.params.id);

  const usuario = usuarios.find((usuario) => usuario.id === id);

  if (!usuario) {
    return res.status(404).json({
      message: "Usuário não encontrado.",
    });
  }
}

function obterDadosUsuario(body, exigirNome = true) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const { nome, email, senha } = body;

  if (
    (exigirNome && (typeof nome !== "string" || nome.trim() === "")) ||
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof senha !== "string" ||
    senha.trim() === ""
  ) {
    return null;
  }

  return {
    nome: typeof nome === "string" ? nome.trim() : undefined,
    email: email.trim().toLowerCase(),
    senha,
  };
}

export async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const usuario = await usuariosModel.criarUsuario({ nome, email, senha });

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario,
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      erro: "Erro ao cadastrar usuário.",
    });
  }
}

export async function loginUsuario(req, res) {
  try {
    const dadosUsuario = obterDadosUsuario(req.body, false);

    if (!dadosUsuario) {
      return res.status(400).json({
        erro: "Email e senha são obrigatórios.",
      });
    }

    const { email, senha } = dadosUsuario;

    const usuario = usuarios.find((usuario) => usuario.email === email);

    if (!usuario) {
      return res.status(401).json({
        erro: "Email ou senha incorretos.",
      });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: "Email ou senha incorretos.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret?.trim()) {
      return res.status(500).json({
        erro: "Erro interno de autenticação.",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },
      jwtSecret,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      erro: "Erro ao realizar login.",
    });
  }
}
