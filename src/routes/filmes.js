import express from "express";

import verificarToken from "../middleware/auth.js";

import {
    cadastrarFilme,
    listarFilmes,
    buscarFilmePorId,
    atualizarFilme,
    excluirFilme
} from "../controllers/filmesController.js";

const router = express.Router();

router.post("/", verificarToken, cadastrarFilme);

router.get("/", verificarToken, listarFilmes);

router.get("/:id", verificarToken, buscarFilmePorId);

router.put("/:id", verificarToken, atualizarFilme);

router.delete("/:id", verificarToken, excluirFilme);

export default router;