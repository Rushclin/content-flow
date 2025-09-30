import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@clerk/nextjs/server";
import { UserDBService, ConversationDBService } from "@/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // const { userId } = await auth();
  const searchParams = new URLSearchParams(req.url?.split("?")?.[1]);

  const userId = searchParams.get('userId');

    const { id } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const userService = new UserDBService();
    const conversationService = new ConversationDBService();

    // Trouver l'utilisateur dans la base de données
    const user = await userService.findByClerkId(userId);

    console.log({user})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer la conversation avec ses messages
    const conversation = await conversationService.findById(id, user.id);

    console.log({conversation})
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}