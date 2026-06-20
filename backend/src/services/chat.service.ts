import { db } from "../db";
import { ChatMessage } from "./llm.service.js";

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: "user" | "ai";
  text: string;
  createdAt: Date;
}

export async function createConversation() {
  const result = await db.query(
    `INSERT INTO conversations DEFAULT VALUES RETURNING *`,
  );
  return mapConversation(result.rows[0]);
}





export async function getConversation(
  id: string,
): Promise<Conversation | null> {
  const result = await db.query("SELECT * FROM conversations WHERE id = $1", [
    id,
  ]);
  if (result.rows.length === 0) return null;
  return mapConversation(result.rows[0]);
}





export async function listConversations(): Promise<Conversation[]> {
  const result = await db.query(
    "SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 20",
  );
  return result.rows.map(mapConversation);
}


export async function updateConversationTitle(
  id: string,
  title: string,
): Promise<void> {
  await db.query(
    "UPDATE conversations SET title = $1, updated_at = NOW() WHERE id = $2",
    [title, id],
  );
}


export async function touchConversation(id: string): Promise<void> {
  await db.query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [
    id,
  ]);
}

export async function saveMessage(
  conversationId: string,
  sender: "user" | "ai",
  text: string,
): Promise<Message> {
  const result = await db.query(
    `INSERT INTO messages (conversation_id, sender, text)
     VALUES ($1, $2, $3) RETURNING *`,
    [conversationId, sender, text],
  );
  return mapMessage(result.rows[0]);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const result = await db.query(
    `SELECT * FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId],
  );
  return result.rows.map(mapMessage);
}

export function messagesToLLMHistory(messages: Message[]): ChatMessage[] {
  return messages.map((m) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text,
  }));
}


function mapConversation(row: Record<string, unknown>): Conversation {
  return {
    id: row.id as string,
    title: row.title as string | null,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  };
}

function mapMessage(row: Record<string, unknown>): Message {
  return {
    id: row.id as string,
    conversationId: row.conversation_id as string,
    sender: row.sender as "user" | "ai",
    text: row.text as string,
    createdAt: row.created_at as Date,
  };
}
