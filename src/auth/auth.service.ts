import { Injectable, UnauthorizedException } from '@nestjs/common';
import { customUsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return customUsersRepository.createUser(authCredentialsDto);
  }
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await customUsersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
