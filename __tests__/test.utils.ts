import { Agent, Response } from 'supertest';

export const wait = (timeout = 1000) => {
  return new Promise((res) => {
    setTimeout(() => {
      res('okay');
    }, timeout);
  });
};

const registrationData = {
  name: 'bibekjodd',
  email: 'bibekjodd@gmail.com',
  password: 'bibekjodd'
};
export const registerUser = (agent: Agent): Promise<Response> => {
  return agent.post('/api/register').send(registrationData);
};

export const loginUser = (agent: Agent): Promise<Response> => {
  return agent.post('/api/login').send(registrationData);
};

export const getUserProfile = (agent: Agent): Promise<Response> => {
  return agent.get('/api/profile');
};

export const logoutUser = (agent: Agent): Promise<Response> => {
  return agent.get('/api/logout');
};

// export const deleteProfile = (agent: Agent): Promise<Response> => {
//   return agent.delete('/api/profile');
// };
