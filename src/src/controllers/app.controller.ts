import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Session } from '../auth/session/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import appConfig from '../config/app.config';
import authConfig from '../config/auth.config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @UseGuards(new AuthGuard())
  async getTest(@Session() session: SessionContainer): Promise<string> {
    // TODO: magic
    return 'magic';
  }
}
