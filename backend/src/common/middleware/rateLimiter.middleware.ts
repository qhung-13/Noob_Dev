import { redisConnection } from "@/config/redis";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (redisConnection.call as any)(...args);
    },
    prefix: "rl:login:",
  }),
  message: {
    success: false,
    message: "Too many login attempts, please try again",
  },
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (redisConnection.call as any)(...args);
    },
    prefix: "rl:general:",
  }),
  message: {
    success: false,
    message: "Too many requests, try again later",
  },
});
