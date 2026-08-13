import pinoHttp from "pino-http";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/config/logger";
import { IncomingMessage, ServerResponse } from "http";

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => (req.headers["x-correlation-id"] as string) || uuidv4(),
  customLevels: (_req: IncomingMessage, res: ServerResponse, err?: Error) => {
    if (res.statusCode >= 500 || err) {
      return "error";
    }
    if (res.statusCode >= 400) {
      return "warn";
    }
    return "info";
  },
});
