import { HttpStatus } from "../../common/statusCode";

export class NotFoundError extends Error {
  public readonly statusCode: HttpStatus = HttpStatus.NO_ENCONTRADO; 

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}