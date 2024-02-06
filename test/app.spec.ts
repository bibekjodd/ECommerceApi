import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../src/app';
const server = app.listen(5001);

afterAll(async () => {
  await mongoose.disconnect();
  server.close();
  server.unref();
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
