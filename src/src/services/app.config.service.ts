import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {
    const appName = this.configService.get<string>('APP_NAME');

    // console.log(appName);
  }
}
