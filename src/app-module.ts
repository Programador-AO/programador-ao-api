import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth-module';
import { DatabaseModule } from './database/database-module';
import { UsuarioModule } from './modules/usuarios/usuario-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule.forRoot(),
    UsuarioModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
