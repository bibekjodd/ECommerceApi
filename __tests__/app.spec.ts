import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../src/app';

afterAll(async () => {
  await mongoose.disconnect();
});

describe('app', () => {
  describe('given the app started', () => {
    it('should return 200', async () => {
      await supertest(app).get('/').expect(200);
    });
  });

  describe('given the route does not exist', () => {
    it('should return 404', async () => {
      await supertest(app).get('/unknown-route').expect(404);
    });
  });
});
