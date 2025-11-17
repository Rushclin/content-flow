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
  metadata?: Record<string, unknown>;
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
  contentJson?: Record<string, unknown>;
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

// Nouvelles interfaces pour la structure de réponse API
export interface ApiMessageMetadata {
  theme?: string;
  details?: string;
  platform?: string;
  generated_at?: string;
  response_status?: number;
}

export interface ApiMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  metadata: ApiMessageMetadata;
  created_at: string;
  updated_at: string;
}

export interface ApiConversationMetadata {
  platform?: string;
  theme?: string;
  created_at?: string;
}

export interface ApiConversation {
  id: string;
  user_id: string;
  title: string;
  metadata: ApiConversationMetadata;
  updated_at: string;
  created_at: string;
  messages: ApiMessage[];
}

export interface GeneratedContentOutput {
  output: string;
}

export interface GenerateWithConversationResponse {
  conversation: ApiConversation;
  user_message: ApiMessage;
  assistant_message: ApiMessage;
  generated_content: GeneratedContentOutput;
}

export interface ConversationListItem {
  id: string;
  user_id: string;
  title: string;
  metadata: ApiConversationMetadata;
  updated_at: string;
  created_at: string;
  message_count: number;
  last_message_preview?: string;
}