import request from 'supertest';
import { MongoClient } from 'mongodb';
import { AppRouterPath, HTTP_STATUSES } from '../src/models/common.types';
import { app } from '../src/settings';
import { ICreateUser } from '../src/models/users/input.types';
import { IUserOutput } from '../src/models/users/output.types';

const uri = process.env.LOCAL || 'mongodb://localhost:27017';

describe(`tests for ${AppRouterPath.users}`, () => {
  const client = new MongoClient(uri);
  beforeAll(async () => {
    await client.connect();
    await request(app).delete(`${AppRouterPath.testing}/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  afterAll(async () => {
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
        items: [],
      });
  });

  // // // -- UNAUTH -- //
  it('- GET item unauth', async () => {
    await request(app).get(AppRouterPath.users).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });
  it('- DELETE item unauth', async () => {
    await request(app).delete(`${AppRouterPath.users}/123`).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });
  it('- POST item unauth', async () => {
    await request(app).post(AppRouterPath.users).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  // // // -- INCORRECT ID -- //
  it('- DELETE item with incorrect id', async () => {
    await request(app)
      .delete(`${AppRouterPath.users}/123`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  // POST INCORRECT BODY
  it('- POST item with incorrect data', async () => {
    const body1: ICreateUser = {
      email: '',
      login: 'Kirill',
      password: 'Qwerty123',
    };
    const body2: ICreateUser = {
      email: 'akir@yandex.ru',
      login: '',
      password: 'Qwerty123',
    };
    const body3: ICreateUser = {
      email: 'akir@yandex.ru',
      login: 'Kirill',
      password: '',
    };

    await request(app)
      .post(AppRouterPath.users)
      .send(body1)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(AppRouterPath.users)
      .send(body2)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(AppRouterPath.users)
      .send(body3)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(AppRouterPath.users)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
  });

  // POST GET CORRECT BODY & ID
  let newItem1: IUserOutput;
  let newItem2: IUserOutput;
  const inputData1: ICreateUser = {
    email: 'email@yandex.ru',
    login: 'login1',
    password: 'password1',
  };
  const inputData2: ICreateUser = {
    email: 'email@gmail.com',
    login: 'login2',
    password: 'password2',
  };
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
        items: [newItem1],
      });
  });
  it('+ POST second item with correct input data', async () => {
    const response = await request(app)
      .post(AppRouterPath.users)
      .send(inputData2)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.CREATED_201);

    newItem2 = response.body;

    expect(newItem2.login).toBe(inputData2.login);
    expect(newItem2.email).toBe(inputData2.email);

    await request(app)
      .get(AppRouterPath.users)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [newItem2, newItem1],
      });
  });

  // AUTH INCORRECT LOGIN PASSWORD
  it('- POST auth with incorrect login', async () => {
    const incorrectData = {
      loginOrEmail: 'email@gmail.ru',
      password: 'password2',
    };

    await request(app).post(`${AppRouterPath.auth}/login`).send(incorrectData).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });
  it('- POST auth with incorrect password', async () => {
    const incorrectData = {
      loginOrEmail: 'email@gmail.com',
      password: 'krya000k',
    };

    await request(app).post(`${AppRouterPath.auth}/login`).send(incorrectData).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  // AUTH CORRECT LOGIN PASSWORD
  it('+ POST auth with correct login', async () => {
    const correctData = {
      loginOrEmail: 'email@gmail.com',
      password: 'password2',
    };

    await request(app).post(`${AppRouterPath.auth}/login`).send(correctData).expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  // DELETE CORRECT ID
  it('+ DELETE fisrt item', async () => {
    await request(app)
      .delete(`${AppRouterPath.users}/${newItem1.id}`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get(AppRouterPath.users)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newItem2],
      });
  });
  it('+ DELETE second item', async () => {
    await request(app)
      .delete(`${AppRouterPath.users}/${newItem2.id}`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get(AppRouterPath.users)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
  });
});
