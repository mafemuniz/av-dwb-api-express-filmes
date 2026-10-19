import express from "express";
import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import verificarToken from "../middleware/auth.js";

const router = express.Router();
const uploadDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../uploads"
);
mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },

    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${randomUUID()}${extensao}`);
    }
});

const upload = multer({

    storage: storage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        const extensao =
            path.extname(file.originalname).toLowerCase();

        const extensoesPermitidas = [
            ".jpg",
            ".jpeg",
            ".png"
        ];

        if (extensoesPermitidas.includes(extensao)) {
            cb(null, true);
        } else {
            const erro = new Error(
                "Apenas arquivos JPG, JPEG e PNG são permitidos."
            );
            erro.status = 400;
            cb(erro);
        }
    }
});

function tratarErroUpload(req, res, next) {
    upload.single("imagem")(req, res, (erro) => {
        if (!erro) {
            return next();
        }

        const erroDoCliente = erro instanceof multer.MulterError ||
            erro.status === 400;
        const status = erroDoCliente ? 400 : 500;
        const mensagem = erro instanceof multer.MulterError &&
            erro.code === "LIMIT_FILE_SIZE"
            ? "O arquivo excede o limite de 2 MB."
            : erro.status === 400
                ? "Apenas arquivos JPG, JPEG e PNG são permitidos."
                : erroDoCliente
                    ? "O arquivo enviado é inválido."
                    : "Erro ao processar o upload.";

        return res.status(status).json({ erro: mensagem });
    });
}

router.post(
    "/",
    verificarToken,
    tratarErroUpload,
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                erro: "Nenhum arquivo foi enviado."
            });
        }

        res.status(201).json({
            mensagem: "Arquivo enviado com sucesso.",
            arquivo: req.file.filename,
            caminho: path.posix.join("src", "uploads", req.file.filename)
        });
    }
);

export default router;