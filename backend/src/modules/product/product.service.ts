import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "@/common/errors/AppError";
import { removeUndefined } from "@/common/utils/removeUndefined";
import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from "./product.dto";

export const listProductsService = async (query: ListProductsQuery) => {
  const { page, limit, categoryId, search } = query;
  const skip = (page - 1) * limit;

  const whereCondition: Prisma.ProductWhereInput = {
    deletedAt: null,
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: whereCondition }),
  ]);

  return {
    products,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getProductByIdService = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
  });

  if (!product) {
    throw new NotFoundError("Product");
  }

  return product;
};

export const createProductService = async (data: CreateProductInput) => {
  return prisma.product.create({
    data: {
      ...data,
      imageUrl: data.imageUrl ?? null,
    },
  });
};

export const updateProductService = async (
  id: string,
  data: UpdateProductInput,
) => {
  await getProductByIdService(id);

  return prisma.product.update({
    where: { id },
    data: removeUndefined(data),
  });
};

export const deleteProductService = async (id: string) => {
  await getProductByIdService(id);

  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
