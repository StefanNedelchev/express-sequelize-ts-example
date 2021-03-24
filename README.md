# ExpressJS + Session + Sequelize + Typescript

## General info
This is a very basic NodeJS application for web API microservices that uses [express](https://github.com/expressjs/express) with [express-session](https://github.com/expressjs/session), [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) to connect to a SQL database and authenticate users. This example includes microservices for basic blog features: registering and authenticating of users (authors) and posting blog posts by authenticated users. The project is set up for using TypeScript and you can see some additional `@types` packages that provide TS support. The app is written following the proper OOP approach using TypeScript classes with decorators and of course - declared types for each variable and function. Additionally, I've used packages like [helmet](https://helmetjs.github.io/) and [bcrypt](https://github.com/kelektiv/node.bcrypt.js) to introduce some security to the app (check out those packages for additional options).

## Setting up
In order to build and run the application you must have **NodeJS** (v13 or higher is recommended) with **npm** on your machine. Having that set up, you need to navigate to the root directory of the project and run the `npm install` command to install all local packages. Since the project is meant to be used with a MySQL database - you need to set up a MySQL server and create a database that you'll be using. Create your local `.env` file and add the necessary variables for accessing the database (host, username, password, etc.). You can find the names of these variables in the `.env.example` file. As you can see, you also need to provide a `SESSION_SECRET` variable which can by any string and it's going to be used to sign the session cookie.
Additionally - make sure that your IDE has TypeScript support and the necessary plug-ins for **TSLint** and **EditorConfig** configurations to work.

## Building and running
Since the source code is in TypeScript, it needs to be compiled first before running. I've set up a few npm scripts that would ease that for you. All compiled files can be found in the `/dist` directory which is located in the root of the project.
1. Running `npm run build` will simply compile the code in JavaScript using the TypeScript CLI.
2. Running `npm run start` will compile the code and run it into a NodeJS server.
3. Running `npm run start:populate_db` will compile the code, run it into a NodeJS server, and *populate the databse with examples*.
4. Running `npm run dev` will use [nodemon](https://nodemon.io/) to directly run your project from the source without the need to compile. It also reloads the app everytime you make changes in your source and save them. This is the required command for running the app in dev environment.

You can also provide a `PORT` environment variable for explicitly chosing a port for the server. Otherwise the app will default to 8080.

## Project structure
### Configuration files
In the root of the project you will find the `package.json` file that each node project has. You can change some properties like name, version, author, description and also add more npm scripts if needed. You have `tsconfig.json` and `tslint.json` files for advanced TypeScript and TSLint configuration. The file `.editorconfig` declares some rules that your IDE should apply to each newly created file. As mentioned above - you might need TSLint and editorconfig plugins for your IDE. The `.env.example` file contains an example of what your environment variables should be. Create a local `.env` file (it should be excluded by gitignore), copy the content of `.env.example` and change the variables to suit your configuration. You can also create multiple files for different configurations (for example - `.env.development` and `env.production`).

### The source code
The source of the project is located in the `/src` folder. The project uses a modular structure - instead of having separate folders for models, controllers and routes, each module is put into its own folder with its respective model, controller and route file. It might seem weird at first but it scales well and it's a better approach if your app tends to grow bigger.

The `routes.ts` file is used to register the API routes and it exports a function which takes the app object as an argument. When you add more modules, you would have to implement their route files in the same way, import them in `routes.ts` and register them in the app.

The `sequelize.ts` file contains the initialization of the database using Sequelize. Sequelize allows you to use a OOP approach of generating models and making queries to the database. As mentioned earlier - all the data for initializing the database is obtained from the environment file. Keep in mind that all data models should be registered here so when you make new entities, simply import the models in `sequelize.ts` and add the classes to the `models` argument (just like I added *User* and *BlogPost*).

The `session.ts` file contains the initialization of the ExpressJS session feature for using session cookies to authenticate the users. By default sequelize store the sessions in files but we use [connect-session-sequelize](https://github.com/mweibel/connect-session-sequelize) to override this behavior so the app will store them in the database.

The `app.ts` file is the main file of the application which is being run by the node server. Here we import all main packages, including our files `routes.ts`, `session.ts` and `sequelize.ts`. All necessary packages and configurations are being applied to the ExpressJS app and then it starts listening on the configured port.

## Running the pre-defined APIs
All microservices can be accessed on the `/api/` url and you can find all route definitions in the `*.routes.ts` fiels of the modules. All end points work with JSON so you need to pass a `content-type: application/json` header. The database is populated with 10 random users and blog-posts using the `faker` package.

### Registering users

For exmaple, to register a user, you need to do a POST request to `<server-url>/api/register` and pass the following JSON structure:
```json
{
  "username": "johndoe1",
  "password": "123456",
  "fullName": "John Doe",
  "email": "johndoe@test.com"
}
```
If the registration was successful, the user should be instantly logged in with a session. A similar request is required for login but on the `/api/login` endpoint using *username* and *password*. If you want to log out simply do an empty POST request to `/api/logout`.

To create a blog post, **you need to be logged in** and do a POST request to `<server-url>/api/blog-posts` and pass the following JSON structure:
```json
{
  "title": "My first blog post",
  "description": "This is my first blog post, I'm so excited!",
  "published": true
}
```
This should create a blog post which will be related to the currently logged user.

Add a couple of blog posts from different users then check out the different routes of the Blog Post module that allow you to do different types of queries.

## Final words
The project can be used as a base on which you can upgrate and scale your application. You can use more advanced methods of authentication, for example using [passport](http://www.passportjs.org/). Additionally, if you prefer different database implementation, you can easily modify the project and use PostgreSQL, MongoDB or many others (they also have dedicated official packages for ExpressJS). Of course in this case you should chose a [different session store for expres-session](https://github.com/expressjs/session#compatible-session-stores) than Sequelize.
