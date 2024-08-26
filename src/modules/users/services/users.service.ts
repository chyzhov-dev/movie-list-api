import { User } from '@modules/users/entities/user.entity';
import { UsersServiceCreateParams } from '@modules/users/types/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private usersRepository: Repository<User>;

  public async findOne(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  public async create(params: UsersServiceCreateParams): Promise<User> {
    const { email, password } = params;
    const existingUser = await this.findOneByEmail(email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }
}
