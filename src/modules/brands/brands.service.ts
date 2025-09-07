import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BrandsService {
  constructor(
    private readonly prisma: PrismaClient,
  ) { }

  async create(createBrandDto: CreateBrandDto) {
    let { name, description, image } = createBrandDto;
    name = name.trim();
    description = description.trim();

    let isEixst = await this.prisma.brands.findFirst({
      where: {
        name: name
      }
    });
    if (isEixst) {
      throw new BadRequestException('Brand is exist');
    }

    let brand = await this.prisma.brands.create({
      data: {
        name,
        description,
        image
      }
    });
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    let { name, description, isActive } = updateBrandDto;
    let isEixst = await this.prisma.brands.findFirst({
      where: {
        id
      }
    });
    if (!isEixst) {
      throw new BadRequestException('Brand not found');
    }
    if (isEixst?.name === name && isEixst?.id !== id) {
      throw new BadRequestException('Brand is exist');
    }
    if (isActive) {
      if (!isEixst.image) {
        throw new BadRequestException('Cannot activate brand without images');
      }
    }
    let brand = await this.prisma.brands.update({
      where: {
        id
      },
      data: {
        name,
        description,
        isActive
      }
    });
    return { ...brand };
  }

  async findAll() {
    return await this.prisma.brands.findMany();
  }

  async findAllPublic() {
    return await this.prisma.brands.findMany({
      where: {
        isActive: true
      }
    });
    
  }

  async findOne(id: string) {
    let brand = await this.prisma.brands.findUnique({
      where: {
        id
      }
    });
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }
    return brand;
  }

  async findOnePublic(id: string) {
    let brand = await this.prisma.brands.findUnique({
      where: {
        id,
        isActive: true
      }
    });
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }
    return brand;
  }
}
