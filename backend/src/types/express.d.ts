import { AuthPayload } from "@/common/middleware/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
