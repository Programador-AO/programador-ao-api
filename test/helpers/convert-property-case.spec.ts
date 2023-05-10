import { toCamelCase, toSnakeCase } from '@helpers/convert-property-case';

test('converte propriedades de camelCase para snake_case', () => {
  const myObject = {
    minhaPropriedade: 'valor',
    outraPropriedade: 'outro valor',
  };

  const expectedObject = {
    minha_propriedade: 'valor',
    outra_propriedade: 'outro valor',
  };

  expect(toSnakeCase(myObject)).toEqual(expectedObject);
});

test('converte propriedades de snake_case para camelCase', () => {
  const myObject = {
    minha_propriedade: 'valor',
    outra_propriedade: 'outro valor',
  };

  const expectedObject = {
    minhaPropriedade: 'valor',
    outraPropriedade: 'outro valor',
  };

  expect(toCamelCase(myObject)).toEqual(expectedObject);
});

test('lança um erro quando o objeto passado não é válido', () => {
  expect(() => {
    toCamelCase('string inválida');
  }).toThrow('Objeto inválido!');
});
