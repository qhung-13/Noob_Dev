import prisma from "@/config/prisma";
import { Prisma, Product } from "@prisma/client";
import { NotFoundError } from "@/common/errors/AppError";
import { removeUndefined } from "@/common/utils/removeUndefined";
import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from "./product.dto";

export const listProductsService = async (query: ListProductsQuery) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const { categoryId, search } = query;
  const skip = (page - 1) * limit;

  let products: Product[];
  let totalCount;

  if (search) {
    const conditions = [
      Prisma.sql`"deletedAt" IS NULL`,
      Prisma.sql`"search_vector" @@ plainto_tsquery('simple', ${search})`,
    ];

    if (categoryId) {
      conditions.push(Prisma.sql`"categoryId" = ${categoryId}`);
    }

    const whereClause = Prisma.join(conditions, " AND ");

    products = await prisma.$queryRaw<Product[]>`
      SELECT id, name, description, price, stock, "imageUrl", "categoryId", "createdAt", "updatedAt", "deletedAt"
      FROM "products"
      WHERE ${whereClause}
      ORDER BY ts_rank("search_vector", plainto_tsquery('simple', ${search})) DESC, "createdAt" DESC
      LIMIT ${limit} OFFSET ${skip}
`;

    const countResult = await prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(*) as total FROM "products"
      WHERE ${whereClause}
    `;
    totalCount = Number(countResult[0]?.total || 0);
  } else {
    const whereCondition: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(categoryId && { categoryId }),
    };

    const [prismaProducts, prismaTotal] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    products = prismaProducts;
    totalCount = prismaTotal;
  }

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
