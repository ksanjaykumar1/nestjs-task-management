import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AppDataSource } from 'src';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export const customUsersRepository = AppDataSource.getRepository(User).extend({
  async createUser(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = this.create({
      username,
      password,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException(`Username already exits`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  },
});
