import prisma from "@/lib/db";
import { ConversationWithMessages } from "@/types/chat";
import { ConversationType, SenderType } from "@prisma/client";

export class ConversationDBService {
  async findById(id: string, userId: string): Promise<ConversationWithMessages | null> {
    const conversation = await prisma.conversation.findUnique({
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

    if (!conversation) return null;

    return {
      ...conversation,
      title: conversation.title || "Conversation sans titre",
      lastMessageAt: conversation.lastMessageAt || conversation.createdAt,
      meta: conversation.meta as any,
      messages: conversation.messages.map((msg) => ({
        id: msg.id,
        content: msg.content || "",
        contentJson: msg.contentJson,
        senderType: msg.senderType,
        senderUserId: msg.senderUserId,
        createdAt: msg.createdAt,
        isDeleted: msg.isDeleted,
      })),
    };
  }

  async findByUserId(userId: string, type?: ConversationType, limit = 50): Promise<ConversationWithMessages[]> {
    const whereCondition: any = {
      createdById: userId,
      deletedAt: null,
    };

    if (type) {
      whereCondition.type = type;
    }

    const conversations = await prisma.conversation.findMany({
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

    return conversations.map((conversation) => ({
      ...conversation,
      title: conversation.title || "Conversation sans titre",
      lastMessageAt: conversation.lastMessageAt || conversation.createdAt,
      meta: conversation.meta as any,
      messages: conversation.messages.map((msg) => ({
        id: msg.id,
        content: msg.content || "",
        contentJson: msg.contentJson,
        senderType: msg.senderType,
        senderUserId: msg.senderUserId,
        createdAt: msg.createdAt,
        isDeleted: msg.isDeleted,
      })),
    }));
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