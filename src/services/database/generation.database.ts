import prisma from "@/lib/db";
import {
  GenerationPlatform,
  GenerationTone,
  GenerationLength,
  ConversationType
} from "@prisma/client";

export interface ConversationCreateData {
  title: string;
  type: ConversationType;
  createdById: string;
  lastMessageAt: Date;
  meta?: any;
}

export interface MessageCreateData {
  conversationId: string;
  senderUserId?: string;
  senderType: "USER" | "ASSISTANT" | "SYSTEM" | "EXTERNAL";
  content: string;
  contentJson?: any;
}

export interface GenerationHistoryCreateData {
  userId: string;
  subject: string;
  content: string;
  platform: GenerationPlatform;
  tone: GenerationTone;
  length: GenerationLength;
  audience?: string;
  metadata?: any;
}

export class GenerationDBService {
  async saveConversation(data: ConversationCreateData) {
    return prisma.conversation.create({
      data,
    });
  }

  async findConversationById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          where: { isDeleted: false },
        },
      },
    });
  }

  async findConversationsByUserId(userId: string, limit = 50) {
    return prisma.conversation.findMany({
      where: {
        createdById: userId,
        type: "GENERATION",
        deletedAt: null,
      },
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

  async updateConversationLastMessage(id: string) {
    return prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    });
  }

  async saveMessage(data: MessageCreateData) {
    return prisma.message.create({
      data,
    });
  }

  async addConversationParticipant(conversationId: string, userId: string, role = "owner") {
    return prisma.conversationParticipant.create({
      data: {
        conversationId,
        userId,
        role,
      },
    });
  }

  async saveGenerationHistory(data: GenerationHistoryCreateData) {
    return prisma.generationHistory.create({
      data,
    });
  }

  async findGenerationHistoryByUserId(userId: string, limit = 50) {
    return prisma.generationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async findGenerationHistoryByPlatform(platform: GenerationPlatform, limit = 50) {
    return prisma.generationHistory.findMany({
      where: { platform },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}