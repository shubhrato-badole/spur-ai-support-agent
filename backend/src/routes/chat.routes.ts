import { Router, Request, Response, NextFunction } from 'express';
import { validateChatMessage } from '../middleware/validate';
import {
  createConversation,
  getConversation,
  getMessages,
  listConversations,
  messagesToLLMHistory,
  saveMessage,
  touchConversation,
  updateConversationTitle,
} from '../services/chat.service.js';
import { generateReply } from '../services/llm.service.js';


      const router = Router();


const ESCALATION_TRIGGERS = [
  'human agent',
  'real person',
  'talk to someone',
  'speak to someone',
  'speak to a human',
  'talk to a human',
  'connect me to',
  'transfer me',
  'escalate',
  'manager',
  'supervisor',
];


   function needsEscalation(message: string): boolean { // it chekces the doesthe the mash form the user cionatin. any of this msg 
  const lower = message.toLowerCase();
  return ESCALATION_TRIGGERS.some((t) => lower.includes(t));
  }


  router.post('/message' , validateChatMessage , async (req , res , next) => {
    try {
        const {message , sessionId} = req.body as {
            message:string;
            sessionId?:string;
        };

        let conversation = sessionId ? await getConversation(sessionId) : null;

        if(!conversation){
           conversation = await  createConversation()
        }
          
        const conversationId = conversation.id;

         if (needsEscalation(message)) {
        await saveMessage(conversationId, 'user', message);
        const escalationReply =
          "I'll connect you with a human agent right away. Our team is available Monday–Saturday, 10 AM–7 PM IST. If it's outside these hours, please email us at support@freshcart.in and we'll respond on the next business day.";
        await saveMessage(conversationId, 'ai', escalationReply);
        await touchConversation(conversationId);
 
        res.json({ reply: escalationReply, sessionId: conversationId });
        return;
      }

         const history = await getMessages(conversationId);
         await saveMessage(conversationId, 'user', message);

           const llmHistory = messagesToLLMHistory(history);
            const reply = await generateReply(llmHistory, message);

               await saveMessage(conversationId, 'ai', reply);
               await touchConversation(conversationId);

          if (!conversation.title && history.length === 0) {
        const title = message.length > 50 ? message.slice(0, 50) + '…' : message;
        await updateConversationTitle(conversationId, title);
      }
 
         res.json({ reply, sessionId: conversationId });

    }catch(err){
     next(err);

    }

  })



  router.get('/conversations',async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const conversations = await listConversations();
      res.json({ conversations });
    } catch (err) {
      next(err);
    }
  }
);


   router.get('/conversations/:id/messages',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversation = await getConversation(req.params.id);
      if (!conversation) {
        res.status(404).json({ error: 'Conversation not found.' });
        return;
      }
      const messages = await getMessages(req.params.id);
      res.json({ messages, conversation });
    } catch (err) {
      next(err);
    }
  }
);
 
export default router;