import { Request, Response } from 'express';

import { Log } from '../models';

export const allLogs = async (req: Request, res: Response) => {
  try {
    const logs = await Log.findAll();
    res.status(200).json({ logs });
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
