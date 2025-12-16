export interface Message {
  id: string;
  date: Date;
  author: string;
  content: string;
  isSystem: boolean;
}

export interface ChatAnalysis {
  totalMessages: number;
  participants: string[];
  messageCountByAuthor: { [author: string]: number };
  dateRange: { start: Date | null; end: Date | null };
  messagesPerDay: { [date: string]: number };
}

 

export enum ViewMode {
  UPLOAD = 'UPLOAD',
  DASHBOARD = 'DASHBOARD',
  HOW_TO_USE = 'HOW_TO_USE'
}

export interface GeminiSummaryResponse {
  summary: string;
  tone: string;
  keyTopics: string[];
}