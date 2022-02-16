import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma.service';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`user id ${id}, not found`);
    }
    return user;
  }

  async create(createuserDto: CreateUserDto) {
    const { email, password } = createuserDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException(`User already exists`);
    }

    const hashPassword = await hash(password, 10);
    await this.prisma.user.create({
      data: { ...createuserDto, password: hashPassword },
    });
    return;
  }

  async update(id: string, updateuserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateuserDto,
    });

    if (!user) {
      throw new NotFoundException(`user id ${id}, not found`);
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`user id ${id}, not found`);
    }
    return user;
  }
}
