import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { BlogPost } from './modules/blog-post/blog-post.model';
import { User } from './modules/user/user.model';

dotenv.config();

let sequelize: Sequelize;

const initializeSequelize = () => {
  if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER) {
    throw new Error('Missing DB configuration in env');
  }

  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        models: [User, BlogPost],
      }
    );
  }

  return sequelize;
};

export const db = { BlogPost, User };
export const intializedSequelize = initializeSequelize();
