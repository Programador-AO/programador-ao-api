import { BadRequestException, Injectable } from '@nestjs/common';

import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { AutenticacaoProviderRepository } from '../../../database/prisma/repositories/autenticacao-provider-repository';
import {
  formatUsername,
  gerarNomeAleatorio,
  isValidNomeUsuario,
} from '../../../helpers/username-helper';

@Injectable()
export class StrategyService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private autenticacaoProviderRepository: AutenticacaoProviderRepository,
  ) {}

  verificarActualizarUsuario = async ({
    provider,
    providerId,
    name,
    avatar,
  }) => {
    const authProvider =
      await this.autenticacaoProviderRepository.getByUsuarioProviderId(
        provider,
        providerId,
      );

    if (!authProvider) return null;

    const usuario = await this.usuarioRepository.getById(
      authProvider.usuarioId,
    );

    if (!usuario) return null;

    if (usuario.nomeCompleto !== name || usuario.avatar !== avatar) {
      const result = await this.usuarioRepository.update(usuario.id, {
        ...usuario,
        nomeCompleto: name,
        avatar,
      });

      if (!result)
        throw new BadRequestException('Não foi possível autenticar o usuário');
    }

    return usuario;
  };

  verificarEmailUsuario = async ({ provider, providerId, email }) => {
    if (!email) return null;

    const usuario = await this.usuarioRepository.getByEmail(email);

    if (!usuario) return null;

    const result = await this.autenticacaoProviderRepository.create({
      provider,
      usuarioId: usuario.id,
      usuarioProviderId: providerId,
      email,
    });

    if (!result)
      throw new BadRequestException('Não foi possível autenticar o usuário');

    return usuario;
  };

  criarNovoUsuarioProvider = async ({
    provider,
    providerId,
    login,
    nomeCompleto,
    avatar,
    email,
    emailVerificado,
    tipo,
  }) => {
    let nomeUsuario = login ?? nomeCompleto;
    if (!nomeUsuario) nomeUsuario = gerarNomeAleatorio();

    const nomeValido = isValidNomeUsuario(nomeUsuario);
    if (!nomeValido) nomeUsuario = formatUsername(nomeUsuario);

    nomeUsuario = await this.sugerirNovoNomeUsuario(nomeUsuario);

    const usuario = await this.usuarioRepository.create({
      nomeCompleto,
      nomeUsuario,
      email,
      emailVerificado,
      avatar,
      tipo,
    });

    if (!usuario)
      throw new BadRequestException('Não foi possível criar o usuário');

    const result = await this.autenticacaoProviderRepository.create({
      provider,
      usuarioId: usuario.id,
      usuarioProviderId: providerId,
      email,
    });

    if (!result)
      throw new BadRequestException(
        'Não foi possível criar o provider do usuário',
      );

    return usuario;
  };

  sugerirNovoNomeUsuario = async (nomeUsuario: string): Promise<string> => {
    let novoNomeUsuario = nomeUsuario;
    const usernameExists = true;
    let counter = 1;

    while (usernameExists) {
      const usuario = await this.usuarioRepository.getByNomeUsuario(
        novoNomeUsuario,
      );

      if (!usuario) return novoNomeUsuario;

      novoNomeUsuario = `${nomeUsuario}${counter}`;
      counter++;
    }

    return novoNomeUsuario;
  };
}
