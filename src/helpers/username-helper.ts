// eslint-disable-next-line @typescript-eslint/no-var-requires
const unidecode = require('unidecode');

const regex = /^[a-zA-Z0-9_-]+$/;

export const isValidNomeUsuario = (nome: string) => regex.test(nome);

export function formatUsername(name: string) {
  // Remove espaços em branco no início e no final do nome de usuário
  // Substitui cada caractere acentuado pelo seu equivalente não acentuado
  let username = unidecode(name.trim());

  username = juntarPrimeiroUltimoNome(username);

  // Remove todos os caracteres que não são letras, dígitos, traços ou sublinhados
  username = username.replace(/[^\w-]/g, '');

  // Remove todas as ocorrências de "-" ou "_"
  username = username.replace(/-\s*_|\s*-\s*|\s*_\s*/g, '_');

  // Substitui "-_" por "_"
  username = username.replace(/-\s*_/g, '_');

  // Substitui "_-" por "_"
  username = username.replace(/_\s*-/g, '_');

  // Substitui todas as ocorrências de "-" ou "_" por apenas um desses caracteres
  username = username.replace(/-+/g, '-').replace(/_+/g, '_');

  return username;
}

export function gerarNomeAleatorio(tamanho = 8): string {
  const randomString = Math.random()
    .toString(36)
    .substring(2, tamanho + 2);

  return randomString;
}

export function juntarPrimeiroUltimoNome(fullName: string): string {
  const names = fullName.trim().split(' ');
  const firstName = names[0].trim();
  const lastName = names.length > 1 ? `_${names[names.length - 1].trim()}` : '';
  return `${firstName}${lastName}`;
}
