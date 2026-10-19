import "dotenv/config";

import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `API de Catálogo de Filmes funcionando em http://localhost:${PORT}`
    );
    console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
});