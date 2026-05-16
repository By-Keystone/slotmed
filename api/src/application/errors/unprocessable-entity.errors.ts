import { ApplicationError } from "./application.errors";

export class UnprocessableEntity extends ApplicationError {
  readonly statusCode = 422;
  readonly code = "UNPROCESSABLE ENTITY";
}
