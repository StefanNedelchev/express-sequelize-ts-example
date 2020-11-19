import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User } from '../user/user.model';
import { BlogPost } from './blog-post.model';


export const create = (req: Request, res: Response) => {
  // Validate request
  if (!req.body.title || !req.body.description) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }
  // create the entity
  const blogPost = new BlogPost({
    title: req.body.title,
    description: req.body.description,
    published: !!req.body.published,
    userId: (req.session as any).user.id,
  });

  blogPost.save()
    .then((data: BlogPost) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the BlogPost.',
      });
    });
};

export const findAll = (req: Request, res: Response) => {
  const { title } = req.query;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : undefined;

  BlogPost.findAll({ where: condition })
    .then((blogPosts: BlogPost[]) => res.send(blogPosts))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving blog posts.',
      });
    });
};

export const findOne = (req: Request, res: Response) => {
  const { id } = req.params;

  BlogPost.findByPk(id)
    .then((blogPost: BlogPost | null) => res.send(blogPost))
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving blog post with id=${id}`,
      });
    });
};

export const update = (req: Request, res: Response) => {
  const { id } = req.params;

  BlogPost.update(req.body as BlogPost, { where: { id }, })
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
    .catch((err) => {
      res.status(500).send({
        message: `Error updating BlogPost with id=${id}`,
      });
    });
};

export const deleteOne = (req: Request, res: Response) => {
  const { id } = req.params;

  BlogPost.destroy({ where: { id }, })
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
    .catch((err) => {
      res.status(500).send({
        message: `Could not delete BlogPost with id=${id}`,
      });
    });
};

export const deleteAll = (req: Request, res: Response) => {
  BlogPost.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => res.send({ message: `${nums} BlogPosts were deleted successfully!` }))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all blog posts.',
      });
    });
};

export const findAllPublished = (req: Request, res: Response) => {
  BlogPost.findAll({ where: { published: true } })
    .then((blogPosts: BlogPost[]) => res.send(blogPosts))
    .catch((err) => {
    res.status(500).send({
      message:
        err.message || 'Some error occurred while retrieving published blog posts.',
    });
  });
};

export const findAllByUsername = (req: Request, res: Response) => {
  const username = req.params.username;

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
        attributes: ['id'],
      }
    ]
  })
    .then((blogPosts: BlogPost[]) => res.send(blogPosts))
    .catch((err) => {
    res.status(500).send({
      message:
        err.message || 'Some error occurred while retrieving blog posts.',
    });
  });
};
