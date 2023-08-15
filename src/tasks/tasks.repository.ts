import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

export interface TasksRepository extends Repository<Task> {
  this: Repository<Task>;
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task>;
  createTask(createTaskDto: CreateTaskDto): Promise<Task>;
  removeTaskById(id: string): Promise<Task>;
  updateTaskById(task: Task, status: TaskStatus): Promise<Task>;
}

export const customTasksRepository: Pick<TasksRepository, any> = {
  getTaskById(this: Repository<Task>, id) {
    return this.findOne({ where: { id } });
  },

  getTasks(this: Repository<Task>) {
    return this.find();
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
