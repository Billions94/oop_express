export class CustomError extends Error {
  public name: string;
  public statusCode: number;

  constructor()
  constructor(name: string)
  constructor(name?: string, statusCode?: number)
  constructor(name: string, statusCode: number, message: string)
  constructor(name?: string, statusCode?: number, message?: string) {
    super(message);
    this.name = <string>name;
    this.statusCode = <number>statusCode;
  }
}
