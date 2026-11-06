import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as usuariosModel from "../models/usuariosModel.js";

function obterDadosUsuario(body, exigirNome = true) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const { nome, email, senha } = body;
  if (
    (exigirNome && (typeof nome !== "string" || !nome.trim())) ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof senha !== "string" ||
    !senha
  ) {
    return null;
  }

  return {
    nome: typeof nome === "string" ? nome.trim() : undefined,
    email: email.trim().toLowerCase(),
    senha,
  };
}

export async function listarUsuarios(_req, res) {
  const usuarios = await usuariosModel.listarUsuarios();
  return res.json(usuarios);
}

export async function buscarUsuario(req, res) {
  const usuario = await usuariosModel.buscarUsuarioPorId(req.params.id);
  if (!usuario) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  return res.json(usuario);
}

export async function cadastrarUsuario(req, res) {
  const dadosUsuario = obterDadosUsuario(req.body);
  if (!dadosUsuario) {
    return res.status(400).json({
      erro: "Nome, email e senha são obrigatórios.",
    });
  }

  const senhaHash = await bcrypt.hash(dadosUsuario.senha, 10);
  try {
    const usuario = await usuariosModel.criarUsuario({
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      senhaHash,
    });
    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario,
    });
  } catch (erro) {
    if (erro.code === "P2002") {
      return res.status(409).json({ erro: "Este email já está cadastrado." });
    }
    throw erro;
  }
}

export async function loginUsuario(req, res) {
  const dadosUsuario = obterDadosUsuario(req.body, false);
  if (!dadosUsuario) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  const usuario = await usuariosModel.buscarUsuarioPorEmail(dadosUsuario.email);
  const senhaCorreta = usuario?.passwordHash
    ? await bcrypt.compare(dadosUsuario.senha, usuario.passwordHash)
    : false;
  if (!senhaCorreta) {
    return res.status(401).json({ erro: "Email ou senha incorretos." });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret?.trim()) {
    return res.status(500).json({ erro: "Erro interno de autenticação." });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    jwtSecret,
    { expiresIn: "1h" },
  );

  return res.status(200).json({
    mensagem: "Login realizado com sucesso.",
    token,
  });
}

