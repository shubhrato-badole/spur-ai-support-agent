import { Request, Response, NextFunction } from "express";
import Anthropic from "@anthropic-ai/sdk";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("[Error]", err);

  if (err instanceof Anthropic.APIError) {
    if (err.status === 429) {
      res.status(503).json({
        error:
          "Our agent is handling too many requests right now. Please try again in a few seconds.",
      });
      return;
    }
    if (err.status === 401) {
      res.status(503).json({
        error: "Support agent is temporarily offline. Please try again later.",
      });
      return;
    }
    if (err.status === 408 || err.message?.includes("timeout")) {
      res.status(503).json({
        error:
          "The agent is taking longer than usual. Please try again in a moment.",
      });
      return;
    }
    res.status(503).json({
      error:
        "Sorry, our support agent is temporarily unavailable. Please try again in a moment.",
    });
    return;
  }

  if (err instanceof Error && err.message?.includes("connect")) {
    res.status(503).json({
      error: "Unable to connect to the database. Please try again shortly.",
    });
    return;
  }

  res.status(500).json({
    error: "Something went wrong on our end. Please try again.",
  });
}
