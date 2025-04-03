import { Request, Response, NextFunction } from 'express';

export interface IRequest extends Request {
  user?: any;
  [key: string]: any;
}

export interface IResponse extends Response {
  [key: string]: any;
}

export type INextFunction = NextFunction;

export interface IRequestHandler {
  (req: IRequest, res: IResponse, next: INextFunction): Promise<void> | void;
} 