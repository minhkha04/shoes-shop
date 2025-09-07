import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { CtreateProductVariantsDto } from './dto/create-product-variants.dto';
import { CreateProductColorDto } from './dto/create-product-color.dto';
import { UpdateProductColorDto } from './dto/update-product-color.dto';

@Injectable()
export class ProductsService {

  constructor(
    private readonly prisma: PrismaClient,
  ) { }

  async create(createProductDto: CreateProductDto) {
    let { name, description, price, brand_id, category_id, image_main, image_hover, colors } = createProductDto;

    let isExist: any = await this.prisma.brands.findUnique({ where: { id: brand_id } });

    if (!isExist) {
      throw new BadRequestException('Brand not found');
    }

    isExist = await this.prisma.categories.findUnique({ where: { id: category_id } });
    if (!isExist) {
      throw new BadRequestException('Category not found');
    }

    isExist = await this.prisma.products.findFirst({ where: { name } });
    if (isExist) {
      throw new BadRequestException('Product name already exists');
    }


    let product = await this.prisma.products.create({
      data: {
        name,
        description,
        price,
        brands_id: brand_id,
        categories_id: category_id,
        image_main,
        image_hover,
        isActive: false,
      }
    });
    let productId = (product as any).id;

    for (let color of colors ?? []) {
      let { color: colorName, code, images, variants } = color;
      let coloeRecord = await this.prisma.product_colors.create({
        data: {
          color: colorName,
          code,
          products_id: productId,
        }
      });
      let colorId = (coloeRecord as any).id;

      for (let image of images ?? []) {
        let imageRecord = await this.prisma.product_colors_image.create({
          data: {
            image: image,
            product_colors_id: colorId,
          }
        });
      }
      for (let variant of variants) {
        let { size, stock } = variant;
        let variantRecord = await this.prisma.product_variants.create({
          data: {
            size,
            stock,
            product_colors_id: colorId,
            products_id: productId,
          }
        });
      }
    }
    let res = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        product_colors: {
          include: {
            product_colors_image: true,
            product_variants: true,
          }
        },
      }
    });
    return res;
  }

  async findAllPublic() {
    let product = await this.prisma.products.findMany({
      where: { isActive: true },
      orderBy: { created_at: 'desc' },
      include: {
        product_colors: {
          include: {
            product_colors_image: true,
            product_variants: true,
          }
        },
        brands: true,
        categories: true,
      },
    });
    return product;
  }

  async findOnePublic(id: string) {
    let product = await this.prisma.products.findFirst({
      where: { id: id, isActive: true },
      include: {
        product_colors: {
          include: {
            product_colors_image: true,
            product_variants: true,
          }
        },
        brands: true,
        categories: true,
      },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product;
  }

  async findAll() {
    let product = await this.prisma.products.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        product_colors: {
          include: {
            product_colors_image: true,
            product_variants: true,
          }
        },
        brands: true,
        categories: true,
      },
    });
    return product;
  }

  async findOne(id: string) {
    let product = await this.prisma.products.findFirst({
      where: { id },
      include: {
        product_colors: {
          include: {
            product_colors_image: true,
            product_variants: true,
          }
        },
        brands: true,
        categories: true,
      },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    let { name, description, price, brand_id, category_id, isActive } = updateProductDto;

    let isExist: any = await this.prisma.products.findFirst({ where: { name } });
    if (isExist && isExist.id !== id) {
      throw new BadRequestException('Product name already exists');
    }

    isExist = await this.prisma.brands.findUnique({ where: { id: brand_id } });
    if (!isExist) {
      throw new BadRequestException('Brand not found');
    }

    isExist = await this.prisma.categories.findUnique({ where: { id: category_id } });
    if (!isExist) {
      throw new BadRequestException('Category not found');
    }

    isExist = await this.prisma.products.findUnique({ where: { id } });
    if (!isExist) {
      throw new BadRequestException('Product not found');
    }

    let product = await this.prisma.products.update({
      where: { id },
      data: { name, description, price, brands_id: brand_id, categories_id: category_id, isActive }
    });
    return product;
  }

  async updateStock(id: string, stock: number) {
    let variant = await this.prisma.product_variants.findUnique({ where: { id } });
    if (!variant) {
      throw new BadRequestException('Product variant not found');
    }
    return await this.prisma.product_variants.update({
      where: { id },
      data: { stock }
    });
  }

  async addNewProductVariant(req: CtreateProductVariantsDto) {
    let { product_colors_id, size, stock } = req;

    let color = await this.prisma.product_colors.findUnique({ where: { id: product_colors_id } });
    if (!color) {
      throw new BadRequestException('Product color not found');
    }

    let variant = await this.prisma.product_variants.findFirst({
      where: {
        product_colors_id,
        size,
      }
    });

    if (variant) {
      throw new BadRequestException('Product variant already exists');
    }

    return await this.prisma.product_variants.create({
      data: {
        product_colors_id,
        size,
        stock,
        products_id: color.products_id,
      }
    });
  }

  async updateProductVariant(id: string, req: CtreateProductVariantsDto) {
    let { product_colors_id, size, stock } = req;
    let variant = await this.prisma.product_variants.findUnique({ where: { id } });
    if (!variant) {
      throw new BadRequestException('Product variant not found');
    }
    let color = await this.prisma.product_colors.findUnique({ where: { id: product_colors_id } });
    if (!color) {
      throw new BadRequestException('Product color not found');
    }
    let check = await this.prisma.product_variants.findFirst({
      where: {
        product_colors_id,
        size,
        NOT: { id }
      }
    });
    if (check) {
      throw new BadRequestException('Product variant already exists');
    }
    return await this.prisma.product_variants.update({
      where: { id },
      data: { product_colors_id, size, stock, products_id: color.products_id }
    });
  }

  async addNewProductColor(req: CreateProductColorDto) {
    let { product_id, color, code, images, variants } = req;

    let product = await this.prisma.products.findUnique({ where: { id: product_id } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    let check = await this.prisma.product_colors.findFirst({
      where: {
        products_id: product_id,
        color,
      }
    });
    if (check) {
      throw new BadRequestException('Product color already exists');
    }
    

      let coloeRecord = await this.prisma.product_colors.create({
        data: {
          color,
          code,
          products_id: product_id,
        }
      });
      let colorId = (coloeRecord as any).id;

      for (let image of images ?? []) {
        let imageRecord = await this.prisma.product_colors_image.create({
          data: {
            image: image,
            product_colors_id: colorId,
          }
        });
      }

      for (let variant of variants) {
        let { size, stock } = variant;
        let variantRecord = await this.prisma.product_variants.create({
          data: {
            size,
            stock,
            product_colors_id: colorId,
            products_id: product_id,
          }
        });
      }

    return await this.prisma.product_colors.findUnique({
      where: { id: colorId },
      include: {
        product_colors_image: true,
        product_variants: true,
      }
    });
  }

  async updateProductColor(id: string, req: UpdateProductColorDto) {
    let { color, code } = req;
    let colorRecord = await this.prisma.product_colors.findUnique({ where: { id } });
    if (!colorRecord) {
      throw new BadRequestException('Product color not found');
    }

    let check = await this.prisma.product_colors.findFirst({
      where: {
        products_id: colorRecord.products_id,
        color,
        NOT: { id }
      }
    });
    if (check) {
      throw new BadRequestException('Product color already exists');
    }
    return await this.prisma.product_colors.update({
      where: { id },
      data: { color, code },
    });
  }
}
