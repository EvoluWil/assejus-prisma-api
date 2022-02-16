import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.partner.findMany();
  }

  async findOne(id: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });
    if (!partner) {
      throw new NotFoundException(`Partner id ${id}, not found`);
    }
    return partner;
  }

  create(createPartnerDto: CreatePartnerDto) {
    return this.prisma.partner.create({ data: createPartnerDto });
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    const partner = await this.prisma.partner.update({
      where: { id },
      data: updatePartnerDto,
    });

    if (!partner) {
      throw new NotFoundException(`Partner id ${id}, not found`);
    }
    return partner;
  }

  async remove(id: string) {
    const partner = await this.prisma.partner.delete({
      where: { id },
    });
    if (!partner) {
      throw new NotFoundException(`Partner id ${id}, not found`);
    }
    return partner;
  }
}
