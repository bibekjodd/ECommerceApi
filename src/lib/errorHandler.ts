export class ErrorHandler extends Error {
  constructor(public message: string, public statusCode?: number) {
    super(message || "Internal Server Error");
    this.statusCode = statusCode;
  }
}
