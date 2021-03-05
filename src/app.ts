import { json, urlencoded } from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import { times, random } from 'lodash';
import faker from 'faker';
import { hidePoweredBy, noSniff, xssFilter } from 'helmet';
import registerRoutes from './routes';
import { intializedSequelize, db } from './sequelize';
import registerSession from './session';

const app: Application = express();

const corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// use gzip compression
app.use(compression());

// use helmet security middlewares
app.use(hidePoweredBy());
app.use(noSniff());
app.use(xssFilter());

// initialize session
registerSession(app, intializedSequelize);

// simple route to check if the server works
app.get('/', (req, res) => {
  res.json({ message: 'It works!' });
});

// register routes
registerRoutes(app);

intializedSequelize
  // Clean tables
  .sync({ force: true })
  .then(async () => {
    console.log('Populate database wit fake data');
    await db.User.bulkCreate(
      times(10, () => ({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        role: random(1, 5),
      }))
    );
    await db.BlogPost.bulkCreate(
      times(10, () => ({
        title: faker.lorem.sentence(5),
        description: faker.lorem.sentence(20),
        published: random(1, 2) == 1,
        userId: random(1, 10),
      }))
    );
    console.log('Database populated');
  })
  .then(() => {
    // set port, listen for requests
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}.`);
    });
  });
