import prisma from "@/lib/db";
import { UserCreate } from "@/types/user";

export class UserDBService {
  async findByClerkId(clerkId: string) {
    return prisma.user.findFirst({
      where: { clerkId },
    });
  }

  async upsertUser(data: UserCreate) {
    return prisma.user.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  async findByUserID(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}
