import { Injectable } from '@nestjs/common';
import { customUsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return customUsersRepository.createUser(authCredentialsDto);
  }
}
