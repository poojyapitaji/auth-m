import { Request, Response } from 'express';

import { Log } from '../models';
import { httpStatus, errorMessages } from '../constants';

export const getAllLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await Log.findAll();
    res.status(httpStatus.OK).json({ logs });
  } catch (error) {
    console.error(
      errorMessages.NotAbleToRetrievingData.replace('{{data}}', 'logs'),
      error
    );
    res
      .status(httpStatus.InternalServerError)
      .json({ error: errorMessages.InternalServerError });
  }
};
