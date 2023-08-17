import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AppDataSource } from 'src';

export const customUsersRepository = AppDataSource.getRepository(User).extend({
  async createUser(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = this.create({
      username,
      password,
    });
    await this.save(user);
  },
});
