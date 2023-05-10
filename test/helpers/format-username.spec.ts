import {
  formatUsername,
  gerarNomeAleatorio,
  juntarPrimeiroUltimoNome,
} from '@helpers/username-helper';

describe('formatUsername', () => {
  it('should remove spaces and replace accented characters', () => {
    expect(formatUsername('João Oliveira')).toBe('Joao_Oliveira');
    expect(formatUsername('María Pérez')).toBe('Maria_Perez');
  });

  it('should remove non-word characters', () => {
    expect(formatUsername('user@domain.com')).toBe('userdomaincom');
    expect(formatUsername('user123!@#')).toBe('user123');
    expect(formatUsername('-_-user-_-')).toBe('_user_');
    expect(formatUsername('---_-user-_-')).toBe('_user_');
    expect(formatUsername('---_-user---_-')).toBe('_user_');
    expect(formatUsername('---_-user---____-')).toBe('_user_');
    expect(formatUsername('-__--_-user---____-')).toBe('_user_');
  });

  it('should format name with only one word', () => {
    const result = formatUsername('John');
    expect(result).toEqual('John');
  });

  it('should format name with multiple words', () => {
    const result = formatUsername('Maria dos Santos');
    expect(result).toEqual('Maria_Santos');
  });

  it('should format name with multiple words and middle name', () => {
    const result = formatUsername('Pedro Edilasio Araujo Lopes');
    expect(result).toEqual('Pedro_Lopes');
  });

  it('should format name with special characters', () => {
    const result = formatUsername('João da Silva!');
    expect(result).toEqual('Joao_Silva');
  });
});

describe('juntarPrimeiroUltimoNome', () => {
  it('should join first and last name when given full name with multiple names', () => {
    const fullName = 'Maria dos Santos';
    const result = juntarPrimeiroUltimoNome(fullName);
    expect(result).toEqual('Maria_Santos');
  });

  it('should join first and last name when given full name with middle name', () => {
    const fullName = 'Pedro Edilasio Araujo Lopes';
    const result = juntarPrimeiroUltimoNome(fullName);
    expect(result).toEqual('Pedro_Lopes');
  });

  it('should only return first name when given full name with only one name', () => {
    const fullName = 'John';
    const result = juntarPrimeiroUltimoNome(fullName);
    expect(result).toEqual('John');
  });

  it('should return empty string when given empty string', () => {
    const fullName = '';
    const result = juntarPrimeiroUltimoNome(fullName);
    expect(result).toEqual('');
  });
});

describe('gerarNomeAleatorio', () => {
  it('should generate a random string with length of 6 characters', () => {
    const randomString = gerarNomeAleatorio();
    console.log(randomString);
    expect(randomString).toMatch(/^[a-z0-9]{8}$/);
  });

  it('should generate a random string with given length', () => {
    expect(gerarNomeAleatorio(4).length).toBe(4);
    expect(gerarNomeAleatorio().length).toBe(8);
    expect(gerarNomeAleatorio(10).length).toBe(10);
  });
});
