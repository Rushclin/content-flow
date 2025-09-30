import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { UserDBService } from "@/services/database/user.database";
import { ConversationDBService } from "@/services";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      conversationId,
      userMessage,
      aiMessage,
      platform,
      tone,
      length,
      audience,
      userId,
    } = req.body;

    if (!userMessage || !aiMessage || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userServce = new UserDBService();
    const conversationServce = new ConversationDBService();
    let user = await userServce.findByClerkId(userId);

    if (!user) {
      user = await userServce.upsertUser({
        clerkId: userId as string,
        id: userId as string,
        avatarUrl: "",
        deletedAt: new Date(),
        email: "",
        name: "",
      });
    }

    let conversation;

    // Si conversationId est fourni, utiliser la conversation existante
    if (conversationId) {
      // conversation = await prisma.conversation.findUnique({
      //   where: { id: conversationId },
      // });
      conversation = await conversationServce.findById(conversationId, user.id);

      if (!conversation || conversation.createdById !== user.id) {
        return res.status(404).json({ message: "Conversation not found" });
      }
    } else {
      // Créer une nouvelle conversation
      // conversation = await prisma.conversation.create({
      //   data: {
      //     title: userMessage.length > 50 ? `${userMessage.substring(0, 50)}...` : userMessage,
      //     type: "GENERATION",
      //     createdById: user.id,
      //     lastMessageAt: new Date(),
      //     meta: {
      //       platform,
      //       tone,
      //       length,
      //       audience,
      //     },
      //   },
      // });

      conversation = await conversationServce.create({
        title:
          userMessage.length > 50
            ? `${userMessage.substring(0, 50)}...`
            : userMessage,
        type: "GENERATION",
        createdById: user.id,
        // lastMessageAt: new Date(),
        meta: {
          platform,
          tone,
          length,
          audience,
        },
      });

      // Ajouter l'utilisateur comme participant
      await prisma.conversationParticipant.create({
        data: {
          conversationId: conversation.id,
          userId: user.id,
          role: "owner",
        },
      });
    }

    // Créer les messages dans la conversation
    const userMsg = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderUserId: user.id,
        senderType: "USER",
        content: userMessage,
        contentJson: {
          metadata: { platform, tone, length, audience },
        },
      },
    });

    const aiMsg = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: "ASSISTANT",
        content: aiMessage,
        contentJson: {
          metadata: { platform, tone, length, audience },
        },
      },
    });

    // Mettre à jour la date du dernier message
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    res.status(200).json({
      success: true,
      data: {
        conversation,
        userMessage: userMsg,
        aiMessage: aiMsg,
      },
    });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    await prisma.$disconnect();
  }
}
