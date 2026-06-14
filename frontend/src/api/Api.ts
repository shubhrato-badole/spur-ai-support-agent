import axios from "axios"


 const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
   timeout: 30000,
   headers: { 'Content-Type': 'application/json' },
})



export async function sendMessage(message: string, sessionId?: string) {
  const { data } = await api.post('/chat/message', { message, sessionId });
  return data as { reply: string; sessionId: string };
}
 
export async function getConversations() {
  const { data } = await api.get('/chat/conversations');
  return data.conversations as { id: string; title: string | null; updatedAt: string }[];
}
 
export async function getMessages(conversationId: string) {
  const { data } = await api.get(`/chat/conversations/${conversationId}/messages`);
  return data.messages as { id: string; sender: 'user' | 'ai'; text: string; createdAt: string }[];
}
 
export async function deleteConversation(id: string) {
  await api.delete(`/chat/conversations/${id}`);
}

