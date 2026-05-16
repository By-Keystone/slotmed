import { ApplicationError } from "./application.errors";

export class UnauthorizedError extends ApplicationError {
  readonly statusCode = 401;
  readonly code = "UNAUTHORIZED";
}
