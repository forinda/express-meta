/**
 * Custom API error class
 */
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  /**
   * Create a new API error
   * @param statusCode HTTP status code
   * @param message Error message
   * @param isOperational Whether the error is operational (expected) or programming (unexpected)
   */
  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
} 