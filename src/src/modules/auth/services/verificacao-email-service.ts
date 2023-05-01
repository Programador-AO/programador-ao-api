import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';

import { useTransport } from '../../../config/mailer';
import appConfig from '../../../config/app.config';

@Injectable()
export class VerificacaoEmailService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async solicitar(id: string) {
    const usuario = await this.usuarioRepository.getById(id);
    if (!usuario) throw new BadRequestException('Usuário não encontrado');

    if (usuario?.emailVerificado)
      throw new BadRequestException('Email já verificado');

    const { emailSuporte, websiteDomain } = appConfig();
    if (!emailSuporte)
      throw new BadRequestException('Email de suporte não configurado');

    const payload = { id: usuario.id };
    const configToken = { expiresIn: '1800s' };
    const token = await this.jwtService.signAsync(payload, configToken);
    const url = `${websiteDomain}/autenticacao/verificar-email?token=${token}`;
    const mailer = await useTransport();

    const sendMailConfig = {
      from: emailSuporte,
      to: usuario.email,
      subject: 'Verificação de e-mail [Programador AO]',
      template: 'autenticacao/verificar_email',
      context: {
        nome: usuario.nomeCompleto,
        url: url,
      },
    };

    const result = await mailer.sendMail(sendMailConfig);

    if (!result)
      throw new BadRequestException('Erro ao enviar e-mail de verificação');
  }

  async verificar(email: string): Promise<void> {
    if (isEmpty(email))
      throw new BadRequestException('email: Campo obrigatório.');

    const usuario = await this.usuarioRepository.getByEmail(email);
    if (usuario?.emailVerificado) {
      throw new BadRequestException('Email já verificado');
    }

    // Implementar regras para validar email

    await this.usuarioRepository.verificarEmail(usuario?.id ?? '');
  }
}
