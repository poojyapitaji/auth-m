import config from 'config';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 5 login request per `window` per minute
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable ht `X-RateLimit-*` headers
  handler: (_req, res, _next, options) => {
    res.sendStatus(options.statusCode);
  }
});

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    (req.headers['authorization'] as string) ||
    (req.headers['Authorization'] as string);
  if (!authHeader) return res.sendStatus(403);
  const accessTokenSecret = config.get<string>('secrets.access_token');
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.sendStatus(401);
  jwt.verify(
    token,
    accessTokenSecret,
    (err: VerifyErrors | null, user: unknown) => {
      if (err) return res.sendStatus(403);
      res.locals.user = user;
      next();
    }
  );
};
