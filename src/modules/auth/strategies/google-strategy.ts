import { Injectable } from '@nestjs/common';
import { RegistrarEmailTelefoneSenhaService } from '../services/registrar-email-telefone-senha.service';

@Injectable()
export class GoogleStrategy {
  async validate(): Promise<any> {
    return;
  }
}
