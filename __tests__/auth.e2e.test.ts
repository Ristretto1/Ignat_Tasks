import request from 'supertest';
import { MongoClient } from 'mongodb';
import { AppRouterPath, HTTP_STATUSES } from '../src/models/common.types';
import { app } from '../src/settings';
import { ICreateUser } from '../src/models/users/input.types';
import { IUserOutput } from '../src/models/users/output.types';
import { createUserData } from './testUtils/users.utils.test';

const uri = process.env.LOCAL || 'mongodb://localhost:27017';

describe(`tests for ${AppRouterPath.users}`, () => {
  const client = new MongoClient(uri);
  beforeAll(async () => {
    await client.connect();
    await request(app).delete(`${AppRouterPath.testing}/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  afterAll(async () => {
    await request(app).delete(`${AppRouterPath.testing}/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204);
    await client.close();
  });

  it('+ GET all items = []', async () => {
    await request(app)
      .get(AppRouterPath.users)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  });

  // POST GET CORRECT BODY & ID
  let token: string;
  let newItem1: IUserOutput;
  const inputData1 = createUserData();

  it('+ POST first item with correct input data', async () => {
    const response = await request(app)
      .post(AppRouterPath.users)
      .send(inputData1)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.CREATED_201);

    newItem1 = response.body;
    expect(newItem1.login).toBe(inputData1.login);
    expect(newItem1.email).toBe(inputData1.email);

    await request(app)
      .get(AppRouterPath.users)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newItem1]
      });
  });

  // AUTH INCORRECT LOGIN PASSWORD
  it('- POST auth with incorrect login', async () => {
    const incorrectData = {
      loginOrEmail: 'liame@gmail.ru',
      password: inputData1.password
    };

    await request(app).post(`${AppRouterPath.auth}/login`).send(incorrectData).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });
  it('- POST auth with incorrect password', async () => {
    const incorrectData = {
      loginOrEmail: inputData1.email,
      password: 'krya000k'
    };

    await request(app).post(`${AppRouterPath.auth}/login`).send(incorrectData).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  // AUTH CORRECT LOGIN PASSWORD
  it('+ POST auth with correct login', async () => {
    const correctData = {
      loginOrEmail: inputData1.email,
      password: inputData1.password
    };

    const res = await request(app).post(`${AppRouterPath.auth}/login`).send(correctData).expect(HTTP_STATUSES.OK_200);
    token = res.body.accessToken;
  });

  // ME INCORRECT TOKEN
  it('- GET me with correct token', async () => {
    await request(app)
      .get(`${AppRouterPath.auth}/me`)
      .auth('00000', { type: 'bearer' })
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  // ME CORRECT TOKEN
  it('+ GET me with correct token', async () => {
    await request(app).get(`${AppRouterPath.auth}/me`).auth(token, { type: 'bearer' }).expect(HTTP_STATUSES.OK_200);
  });
});
