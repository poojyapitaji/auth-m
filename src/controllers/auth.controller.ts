import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import { httpStatus, errorMessages, successMessages } from '../constants';
import { avatar } from '../utils';
import { emailService } from '../services';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UnprocessableEntity)
      .json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(httpStatus.Conflict).json({
        error: errorMessages.UserAlreadyExist.replace('{{email}}', email)
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: passwordHash
    });

    await sendEmailVerificationToken(req, res);

    res.status(httpStatus.Created).json({
      message: successMessages.UserCreationSuccess
    });
  } catch (error) {
    console.error(
      errorMessages.UnableToCreateUser.replace('{{email}}', email),
      error
    );
    res
      .status(httpStatus.InternalServerError)
      .json({ error: errorMessages.InternalServerError });
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UnprocessableEntity)
      .json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      return res
        .status(httpStatus.NotFound)
        .json({ error: errorMessages.UserNotFound.replace('{{uuid}}', email) });
    }

    if (!user.img) {
      user.img = avatar.generateAvatar(user.name);
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res
        .status(httpStatus.Unauthorized)
        .json({ error: errorMessages.InvalidEmailOrPassword });
    }

    const accessTokenSecret = config.get<string>('secrets.access_token');
    const refreshTokenSecret = config.get<string>('secrets.refresh_token');
    const accessTokenExpiry = config.get<string>('secrets.access_token_expiry');
    const refreshTokenExpiry = config.get<string>(
      'secrets.refresh_token_Expiry'
    );

    const accessToken = jwt.sign({ email: user.email }, accessTokenSecret, {
      expiresIn: accessTokenExpiry
    });
    const refreshToken = jwt.sign({ email: user.email }, refreshTokenSecret, {
      expiresIn: refreshTokenExpiry
    });

    res
      .status(httpStatus.OK)
      .cookie('auth-m-rt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: +refreshTokenExpiry
      })
      .json({
        accessToken,
        user: {
          name: user.name,
          email: user.email,
          active: user.active,
          img: user.img
        }
      });
  } catch (error) {
    console.error(errorMessages.LoginFailed, error);
    res
      .status(httpStatus.InternalServerError)
      .json({ error: errorMessages.InternalServerError });
  }
};

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (Object.keys(cookies).length === 0) {
    return res
      .status(httpStatus.NoContent)
      .json({ error: errorMessages.CookieNotFound });
  }

  return res
    .status(200)
    .clearCookie('auth-m-rt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    .json({ message: successMessages.LogoutSuccess });
};

export const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (Object.keys(cookies).length === 0) {
    return res
      .status(httpStatus.NoContent)
      .json({ error: errorMessages.CookieNotFound });
  }

  const refreshToken = cookies['auth-m-rt'];
  if (!refreshToken)
    return res
      .status(httpStatus.Unauthorized)
      .json({ error: errorMessages.CookieNotFound });

  try {
    const accessTokenSecret = config.get<string>('secrets.access_token');
    const refreshTokenSecret = config.get<string>('secrets.refresh_token');
    const accessTokenExpiry = config.get<string>('secrets.access_token_expiry');

    const user = jwt.verify(refreshToken, refreshTokenSecret) as {
      email: string;
    };

    const accessToken = jwt.sign({ email: user.email }, accessTokenSecret, {
      expiresIn: accessTokenExpiry
    });

    res
      .status(httpStatus.OK)
      .json({ message: successMessages.TokenRefreshSuccess, accessToken });
  } catch (error) {
    console.error(errorMessages.TokenRefreshFailed, error);
    res
      .status(httpStatus.Forbidden)
      .json({ error: errorMessages.TokenRefreshFailed });
  }
};

export const sendEmailVerificationToken = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(httpStatus.NoContent)
      .json({ error: errorMessages.InvalidEmail });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(httpStatus.NotFound)
        .json({ error: errorMessages.UserNotFound.replace('{{uuid}}', email) });
    }

    if (user.verified_at) {
      return res
        .status(httpStatus.OK)
        .json({ message: successMessages.EmailAlreadyVerified });
    }

    const emailVerificationSecret = config.get<string>(
      'secrets.email_verification'
    );
    const emailVerificationExpiry = config.get<number>(
      'secrets.email_verification_expiry'
    );

    const token = jwt.sign({ email }, emailVerificationSecret, {
      expiresIn: emailVerificationExpiry
    });

    await User.update(
      {
        verification_token: token,
        verification_token_expires: new Date(Date.now() + 10 * 60 * 1000)
      },
      { where: { email } }
    );

    await emailService.sendEmail({
      to: email,
      subject: 'Email Verification',
      template: 'email_verify',
      data: { token }
    });

    res.status(200).json({
      message: successMessages.VerificationEmailSent
    });
  } catch (error) {
    console.error(errorMessages.NotAbleToSendEmailVerificationLink, error);
    res
      .status(httpStatus.Forbidden)
      .json({ error: errorMessages.NotAbleToSendEmailVerificationLink });
  }
};
