import { Module } from '@nestjs/common';
import { UserService } from './services/user-service';
import { UserController } from './controllers/user-controler';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
