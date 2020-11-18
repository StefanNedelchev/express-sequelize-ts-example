import { hash } from 'bcrypt';
import { Request, Response } from 'express';
import { User } from './user.model';


export const register = async (req: Request, res: Response) => {
  const username: string = req.body.username;

  // Validate request
  if (!username || !req.body.password || !req.body.fullName) {
    res.status(400).send({
      message: 'Missing data!',
    });
    return;
  }

  User.findOne({ where: { username }})
    .then((foundUser: User | null) => {
      if (foundUser) {
        throw new Error('A use with this username already exists! Try to log in or chose another username.');
      }
    })
    .then(() => hash(req.body.password, 8))
    .then(password => new User({
      username,
      password,
      role: req.body.role,
      fullName: req.body.fullName,
    }))
    .then(user => user.save())
    .then(savedUser => {
      // authenticate the user
      (req.session as any).user = savedUser;
      res.status(201).send();
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the user.',
      });
    });
};

export const login = (req: Request, res: Response) => {
  // Validate request
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: 'Missing username or password!',
    });
    return;
  }

  User.findOne({ where: { username: req.body.username }})
    .then((user: User | null) => {
      if (!user) {
        throw new Error('User not found');
      }

      return user.comparePasswrod(req.body.password).then(isMatchingPassword => ({
        user,
        isMatchingPassword
      }));
    })
    .then(({ user, isMatchingPassword }) => {
      if (!isMatchingPassword) {
        throw new Error('Passwords don\'t match');
      }
      // authenticate the user
      (req.session as any).user = user;
      res.status(200).send();
    })
    .catch(() => {
      res.status(401).send({
        message: 'Incorrect username or password!'
      });
    });
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send({
        message: 'An error occured while trying to logout!',
      });
      return;
    }

    res.status(200).send();
  });
};

export const findByUsername = (req: Request, res: Response) => {
  const username: string = req.params.username;
  // Validate request
  if (!username) {
    res.status(400).send({
      message: 'Missing username param!',
    });
    return;
  }

  User.findOne({ where: { username }})
    .then((user: User | null) => res.send(user))
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving User with username=${username}`,
      });
    });
};
