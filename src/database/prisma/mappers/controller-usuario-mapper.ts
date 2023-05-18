import { Usuario as RawUsuario } from '@prisma/client';

export class ControllerUsuarioMapper {
  static toController(usuario: RawUsuario | null) {
    return {
      id: usuario?.id,
      nome_completo: usuario?.nomeCompleto,
      nome_usuario: usuario?.nomeUsuario,
      email: usuario?.email,
      telefone: usuario?.telefone,
      email_verificado: usuario?.emailVerificado,
      telefone_verificado: usuario?.telefoneVerificado,
      avatar: usuario?.avatar,
      tipo: usuario?.tipo,
      activo: usuario?.activo,
    };
  }
}
