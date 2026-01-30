import type { Prisma, PrismaClient } from "@ecomerceNextjs/db";

export async function getDescendantCategoryIds(
  categoryId: string,
  prismaClient: PrismaClient | Prisma.TransactionClient,
): Promise<string[]> {
  const categoryWithChildren = await prismaClient.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      children: {
        select: { id: true },
      },
    },
  });
  if (!categoryWithChildren) {
    return [];
  }
  let descedantIds: string[] = [categoryWithChildren.id];

  for (const child of categoryWithChildren.children) {
    descedantIds = descedantIds.concat(await getDescendantCategoryIds(child.id, prismaClient));
  }

  return descedantIds;
}
