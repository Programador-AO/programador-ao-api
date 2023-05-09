import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { generateRandomCode } from '../../../helpers/code-generator';
import { useTransport } from '../../../config/mailer.config';
import appConfig from '../../../config/app.config';

@Injectable()
export class EsqueciMinhaSenhaService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async execute(email: string): Promise<void> {
    if (!isEmail(email)) throw new BadRequestException('Email inválido.');

    const usuario = await this.usuarioRepository.getByEmail(email);
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    const dataExpiracao = new Date();
    dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 30);
    const configToken = { expiresIn: Math.floor(+dataExpiracao / 1000) };

    const codigo = generateRandomCode(6).toUpperCase();
    const payload = { id: usuario.id, email: usuario.email, codigo };
    const tokenRecuperarSenha = await this.jwtService.signAsync(
      payload,
      configToken,
    );

    const updated = await this.usuarioRepository.update(usuario.id, {
      ...usuario,
      tokenRecuperarSenha,
    });

    if (!updated) throw new BadRequestException('Erro ao atualizar o token.');

    const { emailSuporte, websiteDomain } = appConfig();
    const url = `${websiteDomain}/autenticacao/recuperar-minha-senha?token=${tokenRecuperarSenha}`;
    const mailer = await useTransport();

    const sendMailConfig = {
      from: emailSuporte,
      to: usuario.email,
      subject: 'Recuperar senha [Programador AO]',
      template: 'autenticacao/recuperar_senha',
      context: {
        nome: usuario.nomeCompleto,
        url: url,
      },
    };

    const result = await mailer.sendMail(sendMailConfig);

    if (!result)
      throw new BadRequestException('Erro ao enviar e-mail de verificação');
  }
}
