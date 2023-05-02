// Definir a regex
const regex = /^[a-zA-Z0-9_-]+$/;

export const isValidNomeUsuario = (nome: string) => regex.test(nome);
