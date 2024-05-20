import { Request, Response } from 'express';

import { User } from '../models';
import { httpStatus, errorMessages } from '../constants';

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(httpStatus.OK).json({ users });
  } catch (error) {
    console.error(
      errorMessages.NotAbleToRetrievingData.replace('{{data}}', 'users'),
      error
    );
    res.status(httpStatus.InternalServerError).json({
      error: errorMessages.InternalServerError
    });
  }
};

export const getUserByUuid = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  if (!uuid) return res.status(422).json({ error: errorMessages.InvalidUuid });
  try {
    const user = await User.findOne({ where: { uuid } });
    if (!user)
      return res
        .status(httpStatus.NotFound)
        .json({ error: errorMessages.UserNotFound.replace('{{uuid}}', uuid) });
    res.status(httpStatus.OK).json({ user });
  } catch (error) {
    console.error(
      errorMessages.NotAbleToRetrievingData.replace('{{data}}', 'user'),
      error
    );
    res
      .status(httpStatus.InternalServerError)
      .json({ error: errorMessages.InternalServerError });
  }
};
