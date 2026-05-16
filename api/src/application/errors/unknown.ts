import { ApplicationError } from "./application.errors";

export class UnknownError extends ApplicationError {
  readonly statusCode = 500;
  readonly code = "UNKNOWN";
}
