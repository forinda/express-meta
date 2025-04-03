import { HttpStatusCode } from '../constants/http-status.codes';

export interface ErrorMetadata {
  [key: string]: any;
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

export class ApiError extends Error {
  public readonly statusCode: HttpStatus;
  public readonly metadata?: ErrorMetadata;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    metadata?: ErrorMetadata,
    isOperational = true,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.metadata = metadata;
    this.isOperational = isOperational;
    this.details = details;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      metadata: this.metadata,
      stack: this.stack
    };
  }
} 