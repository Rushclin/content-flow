import { NextApiRequest, NextApiResponse } from "next";
// import { auth } from "@clerk/nextjs/server";
import { UserDBService, ConversationDBService } from "@/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const searchParams = new URLSearchParams(req.url?.split("?")?.[1]);

  const userId = searchParams.get('userId');

  try {
    // const { userId } = await auth();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userService = new UserDBService();
    const conversationService = new ConversationDBService();

    // Trouver l'utilisateur dans la base de données
    const user = await userService.findByClerkId(userId);

    if (!user) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Récupérer les conversations de génération avec leurs messages
    const conversations = await conversationService.findByUserId(
      user.id,
      "GENERATION",
      parseInt(req.query.limit as string) || 50
    );

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}