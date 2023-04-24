import { Injectable } from '@nestjs/common';
import { UserInterface } from '../interfaces/user-interface';

@Injectable()
export class UserService {
  async findOne(username: string): Promise<UserInterface | undefined> {
    const user: UserInterface = {
      id: 'XXXXX',
      name: 'XXXXX',
      email: 'XXXXX',
      password: 'XXXXX',
    };

    return user;
  }
}
