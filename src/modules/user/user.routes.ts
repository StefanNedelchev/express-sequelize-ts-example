import { Application, Router } from 'express';
import { findByUsername, login, logout, register } from './user.controller';

export default (app: Application): void => {
  const router = Router();

  router.post('/register', register);
  router.post('/login', login);
  router.post('/logout', logout);
  router.post('/user/:username', findByUsername);

  app.use('/api/auth', router);
};
