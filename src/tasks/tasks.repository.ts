import { Brackets, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

export interface TasksRepository extends Repository<Task> {
  this: Repository<Task>;
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>;
  getTaskById(id: string): Promise<Task>;
  createTask(createTaskDto: CreateTaskDto): Promise<Task>;
  removeTaskById(id: string): Promise<Task>;
  updateTaskById(task: Task, status: TaskStatus): Promise<Task>;
}

export const customTasksRepository: Pick<TasksRepository, any> = {
  getTaskById(this: Repository<Task>, id) {
    return this.findOne({ where: { id } });
  },

  async getTasks(this: Repository<Task>, filterDto) {
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

  createTask(this: Repository<Task>, createTaskDto) {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    this.save(task);
    return task;
  },
  async removeTaskById(this: Repository<Task>, id) {
    const task = await this.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }
    await this.remove(task);
    return task;
  },
  async updateTaskById(this: Repository<Task>, task: Task, status: TaskStatus) {
    task.status = status;
    await this.save(task);
    return task;
  },
};
