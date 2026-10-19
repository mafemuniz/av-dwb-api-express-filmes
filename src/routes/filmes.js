import express from "express";
import verificarToken from "../middleware/auth.js";
import {
    atualizarFilme,
    buscarFilmePorId,
    cadastrarFilme,
    excluirFilme,
    listarFilmes,
} from "../controllers/filmesController.js";

const router = express.Router();

router.post("/", verificarToken, cadastrarFilme);
router.get("/", verificarToken, listarFilmes);
router.get("/:id", verificarToken, buscarFilmePorId);
router.put("/:id", verificarToken, atualizarFilme);
router.delete("/:id", verificarToken, excluirFilme);

export default router;
