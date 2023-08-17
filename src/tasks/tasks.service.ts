import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { customTasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return customTasksRepository.getTasks(filterDto);
  }
  async getTaskById(id: string): Promise<Task> {
    const found = await customTasksRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }
    return found;
  }
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return customTasksRepository.createTask(createTaskDto);
  }
  deleteTaskById(id: string): Promise<Task> {
    return customTasksRepository.removeTaskById(id);
  }
  async updateTaskById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    return customTasksRepository.updateTaskById(task, status);
  }
}
