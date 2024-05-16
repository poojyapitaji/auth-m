import { Request, Response } from 'express';

import { Log } from '../models';

export const allLogs = async (_req: Request, res: Response) => {
  const logs = await Log.findAll();
  res.status(200).json({ logs });
};
