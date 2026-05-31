'use strict';
import { beforeEach, before, after }from 'node:test';
import supertestfrom 'supertest';
import appfrom '../app';
import Userfrom '../models/users';
import Notesfrom '../models/notes';
import { seedUser, loginUser, notesData }from './test.login.data';
import { startConnection, closeConnection }from '../core/databaseConfig';
import { deleteData }from '../core/mongoQueryHelper';

const api = supertest(app);

// defined first so setupDB can call it
const loginAndGetToken = async () => {
  const res = await api
    .post('/api/auth/login')
    .send(loginUser)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  return res.body.token;
};

const setupDB = () => {
  before(async () => {
    await startConnection();
  });

  beforeEach(async () => {
    await deleteData({ allData: true, model: User });
    await deleteData({ allData: true, model: Notes });
    await api
      .post('/api/auth/register')
      .send(seedUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const token = await loginAndGetToken();
    await api
      .post('/api/notes/note')
      .set('Authorization', `Bearer ${token}`)
      .send(notesData)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  after(async () => {
    await closeConnection();
  });
};

exports = {
  api,
  setupDB,
  loginAndGetToken,
  seedUser,
  loginUser,
  notesData
};
