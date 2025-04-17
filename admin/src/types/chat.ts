export interface Message {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Chat {
  _id: string;
  title?: string;
  messages: Message[];
  lastMessage?: Message;
  updatedAt: string;
  createdAt: string;
} 