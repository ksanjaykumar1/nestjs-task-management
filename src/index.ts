import { DataSource } from 'typeorm';
import { Task } from './tasks/task.entity';
import { User } from './auth/user.entity';
import { Logger } from '@nestjs/common';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'task-management',
  entities: [Task, User],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    const logger = new Logger();
    logger.log('Initialized connection with database');
  })
  .catch((error) => console.log(error));
