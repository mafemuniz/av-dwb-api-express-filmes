import prisma from "../config/prisma.js";

const camposPublicos = {
    id: true,
    email: true,
    name: true,
    createdAt: true,
};

export function criarUsuario({ nome, email, senhaHash }) {
    return prisma.user.create({
        data: { name: nome, email, passwordHash: senhaHash },
        select: camposPublicos,
    });
}

export function listarUsuarios() {
    return prisma.user.findMany({
        orderBy: {
            id: 'asc'
        },
        select: camposPublicos,
    });
}

export function buscarUsuarioPorId(id) {
    return prisma.user.findUnique({
        where: {
            id: String(id),
        },
        select: camposPublicos,
    });
}

export function buscarUsuarioPorEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}

export function atualizarUsuario(id, usuario) {
    const data = { ...usuario };
    if (data.nome !== undefined) {
        data.name = data.nome;
        delete data.nome;
    }
    return prisma.user.update({
        where: {
            id: String(id),
        },
        data,
        select: camposPublicos,
    });
}

export function deletarUsuario(id) {
    return prisma.user.delete({
        where: {
            id: String(id),
        },
        select: camposPublicos,
    });
}