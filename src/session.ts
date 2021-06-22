import connectSession from 'connect-session-sequelize';
import dotenv from 'dotenv';
import { Application } from 'express';
import session, { SessionOptions } from 'express-session';
import { Sequelize } from 'sequelize-typescript';

dotenv.config();

export default (app: Application, sequelize: Sequelize): void => {
  const SequelizeStore = connectSession(session.Store);

  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error('SESSION_SECRET is missing from env!');
  }

  const sessionOptions: SessionOptions = {
    name: 'sesssionId',
    secret,
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now() + (60 * 60 * 1000)),
      // secure: true, // uncomment this to allow secure cookie if you'll be running the app on HTTPS
    },
  };
  app.use(session(sessionOptions));
};
