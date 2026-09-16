const express = require("express");
const multer = require("multer");
const path = require("path");

const verificarToken = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        const extensao = path.extname(file.originalname).toLowerCase();

        const extensoesPermitidas = [
            ".jpg",
            ".jpeg",
            ".png"
        ];

        if (extensoesPermitidas.includes(extensao)) {
            cb(null, true);
        } else {
            cb(new Error("Apenas arquivos JPG, JPEG e PNG são permitidos."));
        }
    }
});

router.post(
    "/",
    verificarToken,
    upload.single("imagem"),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                erro: "Nenhum arquivo foi enviado."
            });
        }

        res.status(201).json({
            mensagem: "Arquivo enviado com sucesso.",
            arquivo: req.file.filename,
            caminho: req.file.path
        });
    }
);

module.exports = router;