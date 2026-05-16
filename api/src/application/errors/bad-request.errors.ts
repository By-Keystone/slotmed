import { ApplicationError } from "./application.errors";

export class BadRequest extends ApplicationError {
  readonly statusCode = 400;
  readonly code = "BAD_REQUEST";
}
