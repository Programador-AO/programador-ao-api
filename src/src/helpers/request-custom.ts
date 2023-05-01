import { UsuarioInterface } from '../modules/usuarios/interfaces/usuario-interface';

export interface RequestCustom extends Request {
  usuario?: UsuarioInterface;
}
