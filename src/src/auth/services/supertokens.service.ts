import supertokens from 'supertokens-node';
import { Inject, Injectable } from '@nestjs/common';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import authConfig from '../../config/auth.config';
import {
  AuthModuleConfig,
  ConfigInjectionToken,
} from '../interfaces/config.interface';

const { recipeList } = authConfig();

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [...recipeList, Session.init(), Dashboard.init()],
    });
  }
}
