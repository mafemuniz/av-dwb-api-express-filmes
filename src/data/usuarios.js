export const usuarios = [];

export let proximoIdUsuario = 1;

export function gerarIdUsuario() {
    return proximoIdUsuario++;
}