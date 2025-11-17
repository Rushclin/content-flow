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