import { SenderType } from "@prisma/client";

export type Platform = "wordpress" | "twitter" | "facebook" | "linkedin" | "reddit";
export type Tone = "professionnel" | "amical" | "formel" | "décontracté";
export type Length = "courte" | "moyenne" | "longue";

export type ConversationType = "CHAT" | "GENERATION" | "VOICE";

export interface GenerationMetadata {
  platform: Platform;
  tone: Tone;
  length: Length;
  audience?: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  metadata?: GenerationMetadata;
}

export interface GenerationRequest {
  subject: string;
  targetAudience: string;
  tone: Tone;
  length: Length;
  platform: Platform;
}

export interface GenerationHistory {
  id: string;
  userId: string;
  subject: string;
  content: string;
  platform: Platform;
  tone: Tone;
  length: Length;
  audience?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationHistory {
  id: string;
  title?: string;
  type: ConversationType;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  messages: ChatMessage[];
}

// export interface ConversationWithMessages {
//   id: string;
//   title: string;
//   type: string;
//   createdAt: string;
//   updatedAt: string;
//   lastMessageAt: string;
//   meta: any;
//   messages: Array<{
//     id: string;
//     content: string;
//     senderType: string;
//     createdAt: string;
//     contentJson: any;
//   }>;
// }

export interface MessageData {
  id: string;
  content: string;
  contentJson?: any;
  senderType: SenderType;
  senderUserId?: string | null;
  createdAt: Date;
  isDeleted: boolean;
}

export interface ConversationMetadata {
  platform?: Platform;
  tone?: Tone;
  length?: Length;
  audience?: string;
}

export interface ConversationWithMessages {
  id: string;
  title: string;
  type: ConversationType;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  meta?: ConversationMetadata;
  messages: MessageData[];
}

export interface ChatMessageType {
  id?: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  metadata?: {
    platform?: string;
    tone?: string;
    length?: string;
  };
}