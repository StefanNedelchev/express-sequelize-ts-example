import { Request, Response } from 'express';
import { Op, SequelizeScopeError, WhereOptions } from 'sequelize';
import { UserSession } from '../../types';
import { User } from '../user/user.model';
import { BlogPost } from './blog-post.model';

export const create = (req: Request, res: Response): void => {
  const requestBody = req.body as Partial<BlogPost>;

  // Validate request
  if (!requestBody.title || !requestBody.description) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  const loggedUser = (req.session as UserSession).user;

  if (!loggedUser || !loggedUser.id) {
    res.status(401).send({
      message: 'Unauthorized access!',
    });
    return;
  }

  // create the entity
  const blogPost = new BlogPost({
    title: requestBody.title,
    description: requestBody.description,
    published: !!requestBody.published,
    userId: loggedUser.id as number,
  });

  blogPost.save()
    .then((data: BlogPost) => res.send(data))
    .catch((err: SequelizeScopeError) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the BlogPost.',
      });
    });
};

export const findAll = (req: Request<unknown, unknown, unknown, { title?: string }>, res: Response): void => {
  const { title } = req.query;
  const condition: WhereOptions<BlogPost> = title ? { title: { [Op.like]: `%${title}%` } } : {};

  BlogPost.findAll({ where: condition })
    .then((blogPosts: BlogPost[]) => res.send(blogPosts))
    .catch((err: SequelizeScopeError) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving blog posts.',
      });
    });
};

export const findOne = (req: Request<{ id: string }>, res: Response): void => {
  const { id } = req.params;

  BlogPost.findByPk(id)
    .then((blogPost: BlogPost | null) => res.send(blogPost))
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving blog post with id=${id}`,
      });
    });
};

export const update = (req: Request<{ id: string }>, res: Response): void => {
  const { id } = req.params;

  BlogPost.update(req.body as BlogPost, { where: { id } })
    .then(([length]) => {
      if (length === 1) {
        res.send({
          message: 'BlogPost was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update BlogPost with id=${id}. Maybe BlogPost was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating BlogPost with id=${id}`,
      });
    });
};

export const deleteOne = (req: Request<{ id: string }>, res: Response): void => {
  const { id } = req.params;

  BlogPost.destroy({ where: { id } })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'BlogPost was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete BlogPost with id=${id}. Maybe BlogPost was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Could not delete BlogPost with id=${id}`,
      });
    });
};

export const deleteAll = (_req: Request, res: Response): void => {
  BlogPost.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => res.send({ message: `${nums} BlogPosts were deleted successfully!` }))
    .catch((err: SequelizeScopeError) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all blog posts.',
      });
    });
};

export const findAllPublished = (_req: Request, res: Response): void => {
  BlogPost.findAll({ where: { published: true } })
    .then((blogPosts: BlogPost[]) => res.send(blogPosts))
    .catch((err: SequelizeScopeError) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving published blog posts.',
      });
    });
};

export const findAllByUsername = (req: Request, res: Response): void => {
  const { username } = req.params;

  if (!username) {
    res.status(400).send({
      message: 'Username can not be empty!',
    });
    return;
  }

  BlogPost.findAll({
    include: [
      {
        model: User,
        required: true,
        where: { username },
        as: 'user',
        attributes: ['id'],
      },
    ],
  }).then((blogPosts: BlogPost[]) => res.send(blogPosts))
    .catch((err: SequelizeScopeError) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving blog posts.',
      });
    });
};
