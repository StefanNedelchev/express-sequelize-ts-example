import { hash } from 'bcrypt';
import faker from 'faker';
import { db, intializedSequelize } from './sequelize';

export default (): Promise<void> => intializedSequelize
  // Clean tables
  .sync({ force: true })
  .then(async () => {
    console.log('Populate database wit fake data');

    await db.User.bulkCreate(await Promise.all(
      Array.from({ length: 10 }).map(async () => ({
        email: faker.internet.email(),
        fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        password: await hash(faker.internet.password(), 8),
        role: faker.datatype.number({ min: 1, max: 5 }),
        username: faker.internet.userName(),
      })),
    ));

    await db.BlogPost.bulkCreate(Array.from({ length: 10 }).map(() => ({
      description: faker.lorem.sentence(20),
      published: faker.datatype.number({ min: 1, max: 2 }) === 1,
      title: faker.lorem.sentence(5),
      userId: faker.datatype.number({ min: 1, max: 10 }),
    })));
    console.log('Database populated');
  });
