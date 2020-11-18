import { Application } from 'express';
import blogPosts from './modules/blog-post/blog-post.routes';
import user from './modules/user/user.routes';

export default (app: Application) => {
  user(app);
  blogPosts(app);
};
