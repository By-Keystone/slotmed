import { ApplicationError } from "./application.errors";

export class NotFound extends ApplicationError {
  readonly statusCode = 404;
  readonly code = "NOT_FOUND";
}
