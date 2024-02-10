import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../../src/app';
import User from '../../src/models/user.model';
import { invalidRegistrationData } from '../test.constants';
import { getUserProfile, loginUser, registerUser, wait } from '../test.utils';

const agent = supertest(app);
afterAll(async () => {
  await User.deleteMany();
  await mongoose.disconnect();
});

describe('User', () => {
  /* unauthenticated cases */
  describe('given the user is not authenticated', () => {
    const protectedRoutes = {
      get: ['/api/profile'],
      post: ['/api/product', '/api/review/id'],
      put: [
        '/api/profile',
        '/api/password/update',
        '/api/product/id',
        '/api/profile'
      ],
      delete: ['/api/profile', '/api/product/id', '/api/review/id']
    };
    it.each(protectedRoutes.get)('GET: /api/%s returns 401', async (route) => {
      const res = await agent.get(route);
      expect(res.statusCode).toBe(401);
    });
    it.each(protectedRoutes.post)(
      'POST: /api/%s returns 401',
      async (route) => {
        const res = await agent.post(route);
        expect(res.statusCode).toBe(401);
      }
    );
    it.each(protectedRoutes.put)('PUT: /api/%s returns 401', async (route) => {
      const res = await agent.put(route);
      expect(res.statusCode).toBe(401);
    });
    it.each(protectedRoutes.delete)(
      'DELETE: /api/%s returns 401',
      async (route) => {
        const res = await agent.delete(route);
        expect(res.statusCode).toBe(401);
      }
    );
  });

  /* invalid cases */
  describe('POST: /api/register', () => {
    describe('returns 400 for every invalid cases', () => {
      it.each(invalidRegistrationData)('', async (data) => {
        await agent.post('/api/register').send(data!).expect(400);
      });
    });
  });

  /* start register */
  describe('POST: /api/register', () => {
    it('POST: /api/login returns 400 before registration', async () => {
      const res = await loginUser(agent);
      expect(res.statusCode).toBe(400);
    });

    it('POST: /api/register returns 201 with user payload', async () => {
      const res = await registerUser(agent);
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toBeDefined();
    });

    it('POST: /api/register returns 400 with same registration data', async () => {
      const res = await registerUser(agent);
      expect(res.statusCode).toBe(400);
    });

    it('GET: /api/profile returns 200 with user payload', async () => {
      const res = await getUserProfile(agent);
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeDefined();
    });

    it('DELETE: /api/profile returns 200', async () => {
      await agent.delete('/api/profile').expect(200);
      await wait();
    });

    it('POST: /api/register returns 201 with user payload', async () => {
      const res = await registerUser(agent);
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toBeDefined();
    });

    it('POST: /api/login returns 200 with user payload', async () => {
      const res = await loginUser(agent);
      expect(res.statusCode).toBe(200);
    });

    it('GET: /api/logout returns 200', async () => {
      await agent.get('/api/logout').expect(200);
    });

    it('GET: /api/profile returns 401 after logout', async () => {
      await agent.get('/api/profile').expect(401);
    });
  });
});
