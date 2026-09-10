const express = require("express");
const multer = require("multer");
const path = require("path");

const verificarToken = require("../middlewares/auth");

const router = express.Router();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "src/uploads/");
    },

    filename: (req, file, cb) => {

        const nomeArquivo =
            Date.now() +
            "-" +
            file.originalname;

        cb(null, nomeArquivo);
    }
});


const upload = multer({

    storage: storage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const tiposPermitidos = [
            ".jpg",
            ".jpeg",
            ".png"
        ];

        const extensao =
            path.extname(file.originalname).toLowerCase();

        if (tiposPermitidos.includes(extensao)) {
            cb(null, true);
        } else {
            cb(new Error("Apenas imagens JPG, JPEG ou PNG são permitidas."));
        }
    }
});


// POST /upload
router.post("/", verificarToken, upload.single("imagem"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            erro: "Nenhuma imagem foi enviada."
        });
    }

    res.status(201).json({
        mensagem: "Imagem enviada com sucesso.",
        arquivo: req.file.filename,
        tamanho: req.file.size
    });
});


module.exports = router;