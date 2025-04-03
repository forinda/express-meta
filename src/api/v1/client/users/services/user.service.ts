import { inject } from 'inversify';
import { UserRepository } from '../repositories/user.repository';
import { User, CreateUserDto, UpdateUserDto } from '../entities/user.entity';
import { BaseService } from '../../shared/services/base.service';
import { AutoRegister } from '../../../../decorators/auto-register.decorator';

@AutoRegister({ autoBind: true })
export class UserService extends BaseService {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository
  ) {
    super();
  }

  async getUsers(): Promise<User[]> {
    return await this.withTransaction(async () => {
      return await this.userRepository.findAll();
    });
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.withTransaction(async () => {
      return await this.userRepository.findById(id);
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return await this.withTransaction(async () => {
      return await this.userRepository.create(data);
    });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User | undefined> {
    return await this.withTransaction(async () => {
      return await this.userRepository.update(id, data);
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.withTransaction(async () => {
      return await this.userRepository.delete(id);
    });
  }

  async createUserWithProfile(data: CreateUserDto, profileData: any): Promise<User> {
    return await this.withTransaction(async () => {
      return await this.userRepository.createWithProfile(data, profileData);
    });
  }

  async findAll(query: any): Promise<User[]> {
    return await this.withTransaction(async () => {
      return await this.userRepository.findAll();
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.withTransaction(async () => {
      const user = await this.userRepository.findById(id);
      return user || null;
    });
  }

  async create(data: Partial<User>): Promise<User> {
    return await this.withTransaction(async () => {
      return await this.userRepository.create(data as CreateUserDto);
    });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return await this.withTransaction(async () => {
      const user = await this.userRepository.update(id, data as UpdateUserDto);
      return user || null;
    });
  }

  async delete(id: string): Promise<boolean> {
    return await this.withTransaction(async () => {
      return await this.userRepository.delete(id);
    });
  }
} 