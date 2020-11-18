import { Application, NextFunction, Request, Response, Router } from 'express';
import { create, deleteAll, deleteOne, findAll, findAllByUsername, findAllPublished, findOne, update } from './blog-post.controller';

export default (app: Application) => {
  const router = Router();

  const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if ((req.session as any).user) {
      next();
    } else {
      const message = 'Not logged in!';
      next(new Error(message));
      res.status(401).send({ message });
    }
  };

  router.post('/', checkLoggedIn, create);
  router.get('/', findAll);
  router.get('/published', findAllPublished);
  router.get('/user/:username', findAllByUsername);
  router.get('/:id', findOne);
  router.put('/:id', checkLoggedIn, update);
  router.delete('/:id', checkLoggedIn, deleteOne);
  router.delete('/', checkLoggedIn, deleteAll);

  app.use('/api/blog-posts', router);
};
