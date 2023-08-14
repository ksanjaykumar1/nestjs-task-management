import { Repository } from 'typeorm';
import { Task } from './task.entity';

export interface TasksRepository extends Repository<Task> {
  this: Repository<Task>;
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task>;
  //   createTask()
}

export const customTasksRepository: Pick<TasksRepository, any> = {
  getTaskById(this: Repository<Task>, id) {
    return this.findOne({ where: { id } });
  },

  getTasks(this: Repository<Task>) {
    return this.find();
  },

  createTask(this: Repository<Task>, task) {
    return this.save(task);
  },
};
