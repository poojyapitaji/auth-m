import request from 'supertest';
import express, { Application } from 'express';

import { userController } from '../controllers';
import { User } from '../models';
import { errorMessages, httpStatus } from '../constants';

jest.mock('../models/user.model');

const app: Application = express();

const allUserRoute = '/api/v1/user/all';
const userByUuidRoute = '/api/v1/user/:uuid';

app.get(allUserRoute, userController.getAllUsers);
app.get(userByUuidRoute, userController.getUserByUuid);

describe('User Controller', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should return all users successfully', async () => {
    const mockUsers = [
      {
        uuid: '9bc237b6-ee7f-48ae-a0a1-e4c7f820f7df',
        name: 'Test User',
        email: 'test@test.com',
        img: null,
        active: true,
        created_at: '2024-05-20 11:09:44',
        updated_at: '2024-05-21 09:24:10'
      },
      {
        uuid: 'f350a813-f298-496b-81e7-2f53ca7ed6e2',
        name: 'Test User',
        email: 'test1@test.com',
        img: null,
        active: true,
        created_at: '2024-05-22 05:54:17',
        updated_at: '2024-05-22 05:54:17'
      }
    ];

    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

    const response = await request(app).get(allUserRoute);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.users).toEqual(mockUsers);
    expect(User.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle error when retrieving all users', async () => {
    const error = new Error(errorMessages.InternalServerError);
    (User.findAll as jest.Mock).mockRejectedValue(error);

    const response = await request(app).get(allUserRoute);

    expect(response.status).toBe(httpStatus.InternalServerError);
    expect(response.body.error).toEqual(errorMessages.InternalServerError);
    expect(User.findAll).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});
