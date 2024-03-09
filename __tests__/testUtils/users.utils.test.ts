import request from 'supertest';
import { AppRouterPath, HTTP_STATUSES } from '../../src/models/common.types';
import { ICreateUser } from '../../src/models/users/input.types';
import { IUserOutput } from '../../src/models/users/output.types';

export const createUserData = (): ICreateUser => {
  return {
    email: `email@yandex.ru`,
    login: `login`,
    password: 'password'
  };
};

export const createUser = async (app: any): Promise<IUserOutput> => {
  const data = createUserData();
  const response = await request(app)
    .post(AppRouterPath.users)
    .send(data)
    .set('authorization', 'Basic YWRtaW46cXdlcnR5')
    .expect(HTTP_STATUSES.CREATED_201);

  return response.body;
};

export const getTokenExistUser = async (app: any): Promise<string> => {
  const data = createUserData();
  await request(app)
    .post(AppRouterPath.users)
    .send(data)
    .set('authorization', 'Basic YWRtaW46cXdlcnR5')
    .expect(HTTP_STATUSES.CREATED_201);

  const correctData = {
    loginOrEmail: data.email,
    password: data.password
  };

  const res = await request(app).post(`${AppRouterPath.auth}/login`).send(correctData).expect(HTTP_STATUSES.OK_200);
  return res.body.accessToken;
};
