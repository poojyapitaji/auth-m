import config from 'config';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';

interface JwtPayload {
  uuid: string;
  name: string;
  email: string;
}

export const authRateLimiter = rateLimit({
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

  if (!authHeader)
    return res.status(403).json({ error: 'Authorization header missing' });

  const token = authHeader && authHeader.split(' ')[1];

  if (token === null)
    return res.status(401).json({ error: 'Token not provided' });

  const accessTokenSecret = config.get<string>('secrets.access_token');

  jwt.verify(
    token,
    accessTokenSecret,
    (err: VerifyErrors | null, decoded: unknown) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.status(403).json({ error: 'Token verification failed' });
      }

      const user = decoded as JwtPayload;
      if (!user) {
        return res.status(403).json({ error: 'Token verification failed' });
      }

      res.locals.user = user;
      next();
    }
  );
};
