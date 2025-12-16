import type { Message } from '../types';
import type { ChatAnalysis } from '../types';

export const parseChatFile = async (file: File): Promise<Message[]> => {
  const text = await file.text();
  return parseChatText(text);
};

export const parseChatText = (text: string): Message[] => {
  // Remove BOM and normalize newlines
  const cleanText = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const lines = cleanText.split('\n');
  const messages: Message[] = [];
  
  // REGEX PATTERNS
  
  // 1. iOS: [DD/MM/YY, HH:MM:SS] Author: Message
  // Matches: [25/12/23, 10:00:00 PM] Author: Message
  // Also handles [25.12.23 10:00:00]
  const regexIOS = /^\[(\d{1,4}[./-]\d{1,2}[./-]\d{1,4})[,.]?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]\s+(.*?):\s+(.+)/i;

  // 2. Android: DD/MM/YY, HH:MM - Author: Message
  // Matches: 25/12/2023, 10:00 - Author: Message
  // Matches: 25/12/2023, 10:00 am - Author: Message
  const regexAndroid = /^(\d{1,4}[./-]\d{1,2}[./-]\d{1,4})[,.]?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s+-\s+(.*?):\s+(.+)/i;

  // System Messages
  const regexSystemIOS = /^\[(\d{1,4}[./-]\d{1,2}[./-]\d{1,4})[,.]?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]\s+(.+)/i;
  const regexSystemAndroid = /^(\d{1,4}[./-]\d{1,2}[./-]\d{1,4})[,.]?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s+-\s+(.+)/i;

  let currentMessage: Message | null = null;

  lines.forEach((line, index) => {
    // Sanitize invisible chars (LRM, RLM, NBSP, Narrow NBSP)
    // Replace them with a single space to prevent regex failures
    line = line.replace(/[\u200E\u200F\u00A0\u202F]/g, " ").trim(); 
    if (!line) return;

    let match = line.match(regexIOS) || line.match(regexAndroid);
    let isSystem = false;
    let author = 'System';
    let content = '';
    let dateStr = '';
    let timeStr = '';

    if (match) {
      dateStr = match[1];
      timeStr = match[2];
      author = match[3];
      content = match[4];
    } else {
      // Check for system message
      match = line.match(regexSystemIOS) || line.match(regexSystemAndroid);
      if (match) {
        // Double check it's not a regular message that failed the author regex
        isSystem = true;
        dateStr = match[1];
        timeStr = match[2];
        content = match[3];
      }
    }

    if (match) {
      const timestamp = parseDateTime(dateStr, timeStr);

      if (currentMessage) {
        messages.push(currentMessage);
      }

      currentMessage = {
        id: `msg-${index}-${Date.now()}`,
        date: timestamp,
        author: author,
        content: content,
        isSystem: isSystem
      };
    } else {
      // Multiline message append
      if (currentMessage) {
        currentMessage.content += '\n' + line;
      }
    }
  });

  if (currentMessage) {
    messages.push(currentMessage);
  }

  return messages;
};

const parseDateTime = (dateStr: string, timeStr: string): Date => {
  // Normalize date separators
  const normalizedDate = dateStr.replace(/[-.]/g, '/');
  const parts = normalizedDate.split('/');
  
  if (parts.length !== 3) return new Date(); // Fallback

  let p0 = parseInt(parts[0], 10);
  let p1 = parseInt(parts[1], 10);
  let p2 = parseInt(parts[2], 10);

  let day, month, year;

  // Check for YYYY-MM-DD format (ISOish)
  if (p0 > 31) {
    year = p0;
    month = p1 - 1;
    day = p2;
  } else {
    // DD/MM/YYYY or MM/DD/YYYY
    // p2 is likely year if it's 2 or 4 digits.
    year = p2;
    if (year < 100) year += 2000;

    day = p0;
    month = p1 - 1;

    // US Format check (MM/DD/YYYY)
    // Heuristic: If we parsed "month" (p1-1) and it's > 11, we MUST swap.
    // This happens if p1 was actually 25 (so month became 24).
    // If p0 (day) was 12, it's valid as a month.
    if (month > 11) {
       // invalid month, assume swap: MM/DD/YYYY -> p0 is Month, p1 is Day
       const temp = day;
       day = month + 1; // recover p1
       month = temp - 1; // use p0
    } 
  }

  // Parse Time
  const timeParts = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s?(AM|PM)?/i);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (timeParts) {
    hours = parseInt(timeParts[1], 10);
    minutes = parseInt(timeParts[2], 10);
    seconds = timeParts[3] ? parseInt(timeParts[3], 10) : 0;
    const meridian = timeParts[4] ? timeParts[4].toUpperCase() : null;

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
  }

  const date = new Date(year, month, day, hours, minutes, seconds);
  
  // Validation check
  if (isNaN(date.getTime())) return new Date();
  
  return date;
};

export const analyzeChat = (messages: Message[]): ChatAnalysis => {
  const participants = new Set<string>();
  const messageCountByAuthor: { [author: string]: number } = {};
  const messagesPerDay: { [date: string]: number } = {};
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  messages.forEach(msg => {
    if (!msg.isSystem) {
      participants.add(msg.author);
      messageCountByAuthor[msg.author] = (messageCountByAuthor[msg.author] || 0) + 1;
    }

    if (!startDate || msg.date < startDate) startDate = msg.date;
    if (!endDate || msg.date > endDate) endDate = msg.date;

    // Daily stats
    try {
        const dateKey = msg.date.toISOString().split('T')[0];
        messagesPerDay[dateKey] = (messagesPerDay[dateKey] || 0) + 1;
    } catch (e) {
        // Ignore invalid dates
    }
  });

  return {
    totalMessages: messages.length,
    participants: Array.from(participants),
    messageCountByAuthor,
    dateRange: { start: startDate, end: endDate },
    messagesPerDay
  };
};
  