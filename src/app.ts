import { json, urlencoded } from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import { hidePoweredBy, noSniff, xssFilter } from 'helmet';
import registerRoutes from './routes';
import sequelize from './sequelize';
import registerSession from './session';

// Uncomment the param passed to the sync method if you want your tables
// to be dropped and re-created on each build
sequelize?.sync(/*{ force: true }*/).then(() => {
  console.log('Update database');
});

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
registerSession(app, sequelize);

// simple route to check if the server works
app.get('/', (req, res) => {
  res.json({ message: 'It works!' });
});

// register routes
registerRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
