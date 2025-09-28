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