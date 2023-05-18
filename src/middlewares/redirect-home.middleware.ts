import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RedirectHomeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let origin = req.originalUrl;

    const URL_REDIRECT = ['/', '/v1'];
    const UMA_POSICAO = 1;
    const indexOf = req.originalUrl.lastIndexOf('/');
    const length = req.originalUrl.length - UMA_POSICAO;

    if (indexOf > -UMA_POSICAO && indexOf === length) {
      origin = origin.substring(0, length);
    }

    if (URL_REDIRECT.includes(origin)) {
      res.redirect('/docs');
    } else {
      next();
    }
  }
}
