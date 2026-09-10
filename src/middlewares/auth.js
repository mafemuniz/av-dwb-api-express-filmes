const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {

    const autorizacao = req.headers.authorization;

    if (!autorizacao) {
        return res.status(401).json({
            erro: "Token não informado."
        });
    }

    const partes = autorizacao.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({
            erro: "Formato do token inválido."
        });
    }

    const token = partes[1];

    try {

        const usuario = jwt.verify(
            token,
            "chave-secreta-av2"
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