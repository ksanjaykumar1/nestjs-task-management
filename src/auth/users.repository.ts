import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AppDataSource } from 'src';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const customUsersRepository = AppDataSource.getRepository(User).extend({
  async createUser(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
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
