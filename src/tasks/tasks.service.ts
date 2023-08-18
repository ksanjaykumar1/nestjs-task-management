import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { customTasksRepository } from './tasks.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return customTasksRepository.getTasks(filterDto, user);
  }
  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await customTasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }
    return found;
  }
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return customTasksRepository.createTask(createTaskDto, user);
  }
  deleteTaskById(id: string, user: User): Promise<Task> {
    return customTasksRepository.removeTaskById(id, user);
  }
  async updateTaskById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    return customTasksRepository.updateTaskById(task, status);
  }
}
