export class Unauthorized extends Error {
  readonly status = 401;

  constructor(message: string) {
    super(message);
  }
}

export class MissingAuthToken extends Unauthorized {
  constructor(message: string) {
    super(message);
  }
}
