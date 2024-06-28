import { NextFunction, Request, Response } from 'express';
export function requestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (
    req.method === 'GET' ||
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/logout')
  ) {
    next();
  } else {
    res.send({ code: -1, msg: '演示系统,禁止操作!', data: null });
  }
}
