import prisma from "../config/prisma.js";

export function criarUsuario(usuario) {
    return prisma.usuarios.create({
        data: usuario
    });
}

export function listarUsuarios() {
    return prisma.usuarios.findMany({
        orderBy: {
            id: 'asc'
        }
    });
}

export function buscarUsuarioPorId(id) {
    return prisma.usuarios.findUnique({
        where: {
            id: Number(id)
        }
    });
}

export function atualizarUsuario(id, usuario) {
    return prisma.usuarios.update({
        where: {
            id: Number(id)
        },
        data: usuario
    });
}

export function deletarUsuario(id) {
    return prisma.usuarios.delete({
        where: {
            id: Number(id)
        }
    });
}  