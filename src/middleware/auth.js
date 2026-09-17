require("dotenv").config();

const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            erro: "Token não informado."
        });
    }

    const partes = authHeader.split(" ");

    const tipo = partes[0];
    const token = partes[1];

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({
            erro: "Formato do token inválido."
        });
    }

    try {

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuario;

        next();

    } catch (erro) {

        return res.status(401).json({
            erro: "Token inválido ou expirado."
        });

    }
}

module.exports = verificarToken;