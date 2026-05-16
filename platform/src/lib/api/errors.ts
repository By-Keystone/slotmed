export class AuthExpiredError extends Error {
  constructor(message = "Session expired") {
    super(message);
    this.name = "AuthExpiredError";
  }
}

export class NoMembershipError extends Error {
  constructor(message = "No memberships found for the user") {
    super(message);
    this.name = "NoMembershipError";
  }
}
