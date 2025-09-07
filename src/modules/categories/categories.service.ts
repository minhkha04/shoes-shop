import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoriesService {

  constructor(private readonly prisma: PrismaClient) { }

  async create(createCategoryDto: CreateCategoryDto) {
    let { name, description } = createCategoryDto;
    let isExist = await this.prisma.categories.findFirst({
      where: {
        name: name
      }
    });
    if (isExist) {
      throw new BadRequestException('Category name already exists');
    }

    return await this.prisma.categories.create({
      data: {
        name,
        description
      }
    });
  }

  async findAll() {
    return await this.prisma.categories.findMany();
  }

  async findOne(id: string) {
    let isExist = await this.prisma.categories.findFirst({
      where: {
        id
      }
    });
    if (!isExist) {
      throw new BadRequestException('Category not found');
    }
    return isExist;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    let { name, description } = updateCategoryDto;
    // check name exist
    let isExist = await this.prisma.categories.findFirst({
      where: {
        id
      }
    });
    if (!isExist) {
      throw new BadRequestException('Category not found');
    }
    if (isExist.name === name && isExist.id !== id) {
      throw new BadRequestException('Category name already exists');
    }
    return await this.prisma.categories.update({
      where: {
        id
      },
      data: {
        name,
        description
      }
    });
  }
}
