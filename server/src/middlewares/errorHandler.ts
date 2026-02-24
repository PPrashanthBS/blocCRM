import { NextFunction, Request, Response } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
  });
};
