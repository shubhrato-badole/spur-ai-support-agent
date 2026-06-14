import { Request, Response, NextFunction } from 'express';

const MAX_MESSAGE_LENGTH = 2000;

export function validateChatMessage(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { message } = req.body;

  if (message === undefined || message === null) {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  if (typeof message !== 'string') {
    res.status(400).json({ error: 'Message must be a string.' });
    return;
  }

  if (message.trim().length === 0) {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    req.body.message = message.slice(0, MAX_MESSAGE_LENGTH);
  }

  next();
}