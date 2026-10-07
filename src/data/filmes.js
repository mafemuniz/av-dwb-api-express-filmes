export const filmes = [];

export let proximoIdFilme = 1;

export function gerarIdFilme() {
    return proximoIdFilme++;
}