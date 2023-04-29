import { Request } from 'express';
import { TipoUsuario } from '@prisma/client';

export interface UsuarioInterface {
  id?: string;
  nomeCompleto: string;
  nomeUsuario: string;
  email: string;
  telefone: string;
  emailVerificado?: boolean;
  telefoneVerificado?: boolean;
  senhaHash?: string;
  avatar?: string;
  tipo?: TipoUsuario;
  recuperarSenhaToken?: string;
  recuperarSenhaDataExpiracao?: string;
  activo?: boolean;
}

export interface RequestCustom extends Request {
  usuario?: UsuarioInterface;
}
