import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';

import { useTransport } from '../../../config/mailer';
import appConfig from '../../../config/app.config';
import authConfig from '../../../config/auth.config';

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

    const payload = { id: usuario.id, email: usuario.email };
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

    const response = await this.usuarioRepository.setTokenVerificacaoEmail(
      usuario.id,
      token,
    );

    if (!response)
      throw new BadRequestException('Erro ao salvar token de verificação');

    const result = await mailer.sendMail(sendMailConfig);

    if (!result)
      throw new BadRequestException('Erro ao enviar e-mail de verificação');
  }

  async verificar(id: string, token: string) {
    if (isEmpty(token))
      throw new BadRequestException('token: Campo obrigatário.');

    const usuario = await this.usuarioRepository.getById(id);
    if (usuario?.tokenVerificacaoEmail !== token)
      throw new BadRequestException('Token inválido');

    const payload = await this.jwtService.verifyAsync(token, {
      secret: authConfig().jwtSecret,
    });

    if (payload.id !== usuario?.id)
      throw new BadRequestException('Token inválido');

    if (payload.email !== usuario?.email)
      throw new BadRequestException('Token inválido');

    if (usuario?.emailVerificado)
      throw new BadRequestException('Email já verificado');

    const responseToken = await this.usuarioRepository.setTokenVerificacaoEmail(
      usuario.id,
      null,
    );

    if (!responseToken)
      throw new BadRequestException('Erro ao salvar token de verificação');

    const response = await this.usuarioRepository.verificarEmail(
      usuario?.id ?? '',
    );

    if (!response) throw new BadRequestException('Erro ao verificar e-mail');
  }
}
