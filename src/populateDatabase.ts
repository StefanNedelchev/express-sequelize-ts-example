// tslint:disable: no-console
import faker from 'faker';
import { random, times } from 'lodash';
import { db, intializedSequelize } from './sequelize';

export default (): Promise<void> =>
  intializedSequelize
    // Clean tables
    .sync({ force: true })
    .then(async () => {
      console.log('Populate database wit fake data');
      await db.User.bulkCreate(
        times(10, () => ({
          email: faker.internet.email(),
          fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
          password: faker.internet.password(),
          role: random(1, 5),
          username: faker.internet.userName(),
        }))
      );
      await db.BlogPost.bulkCreate(
        times(10, () => ({
          description: faker.lorem.sentence(20),
          published: random(1, 2) == 1,
          title: faker.lorem.sentence(5),
          userId: random(1, 10),
        }))
      );
      console.log('Database populated');
    });
