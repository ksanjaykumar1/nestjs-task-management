import { Brackets } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AppDataSource } from 'src';
import { User } from 'src/auth/user.entity';

export const customTasksRepository = AppDataSource.getRepository(Task).extend({
  getTaskById(id: string, user: User) {
    return this.findOne({ where: { id, user } });
  },

  async getTasks(filterDto: GetTasksFilterDto, user: User) {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
            { search: `%${search}%` },
          );
        }),
      );
    }
    const tasks = await query.getMany();
    return tasks;
  },

  createTask(createTaskDto: CreateTaskDto, user: User) {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    this.save(task);
    return task;
  },
  async removeTaskById(id: string, user: User) {
    const task = await this.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }
    await this.remove(task);
    return task;
  },
  async updateTaskById(task: Task, status: TaskStatus) {
    task.status = status;
    await this.save(task);
    return task;
  },
});
