import { Brackets } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AppDataSource } from 'src';

export const customTasksRepository = AppDataSource.getRepository(Task).extend({
  getTaskById(id: string) {
    return this.findOne({ where: { id } });
  },

  async getTasks(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
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

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    this.save(task);
    return task;
  },
  async removeTaskById(id: string) {
    const task = await this.findOne({ where: { id } });
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
