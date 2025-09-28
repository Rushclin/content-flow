import prisma from "@/lib/db";
import { ConversationType, SenderType } from "@prisma/client";

export interface ConversationWithMessages {
  id: string;
  title?: string | null;
  type: ConversationType;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date | null;
  meta?: any;
  messages: Array<{
    id: string;
    content?: string | null;
    contentJson?: any;
    senderType: SenderType;
    senderUserId?: string | null;
    createdAt: Date;
    isDeleted: boolean;
  }>;
}

export class ConversationDBService {
  async findById(id: string, userId: string): Promise<ConversationWithMessages | null> {
    return prisma.conversation.findUnique({
      where: {
        id,
        createdById: userId,
        deletedAt: null,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          where: { isDeleted: false },
        },
      },
    });
  }

  async findByUserId(userId: string, type?: ConversationType, limit = 50) {
    const whereCondition: any = {
      createdById: userId,
      deletedAt: null,
    };

    if (type) {
      whereCondition.type = type;
    }

    return prisma.conversation.findMany({
      where: whereCondition,
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          where: { isDeleted: false },
        },
      },
      orderBy: { lastMessageAt: "desc" },
      take: limit,
    });
  }

  async create(data: {
    title?: string;
    type: ConversationType;
    createdById: string;
    meta?: any;
  }) {
    return prisma.conversation.create({
      data: {
        ...data,
        lastMessageAt: new Date(),
      },
    });
  }

  async update(id: string, data: {
    title?: string;
    lastMessageAt?: Date;
    meta?: any;
  }) {
    return prisma.conversation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return prisma.conversation.update({
      where: {
        id,
        createdById: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async archive(id: string, userId: string) {
    return prisma.conversation.update({
      where: {
        id,
        createdById: userId,
      },
      data: {
        archivedAt: new Date(),
      },
    });
  }

  async addMessage(data: {
    conversationId: string;
    senderUserId?: string;
    senderType: SenderType;
    content: string;
    contentJson?: any;
    metadata?: any;
  }) {
    const message = await prisma.message.create({
      data,
    });

    await this.update(data.conversationId, {
      lastMessageAt: new Date(),
    });

    return message;
  }

  async getMessages(conversationId: string, limit = 100, offset = 0) {
    return prisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
      },
      orderBy: { createdAt: "asc" },
      take: limit,
      skip: offset,
    });
  }

  async updateMessage(messageId: string, data: {
    content?: string;
    contentJson?: any;
    isEdited?: boolean;
  }) {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async deleteMessage(messageId: string) {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
      },
    });
  }

  async addParticipant(conversationId: string, userId: string, role = "member") {
    return prisma.conversationParticipant.create({
      data: {
        conversationId,
        userId,
        role,
      },
    });
  }

  async removeParticipant(conversationId: string, userId: string) {
    return prisma.conversationParticipant.delete({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });
  }

  async getParticipants(conversationId: string) {
    return prisma.conversationParticipant.findMany({
      where: { conversationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}