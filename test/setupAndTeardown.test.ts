import Example from '../src/models/Example';

import { cleanCollection, setupDatabase, teardownDatabase } from './helpers/databaseControls';

before(async () => {
  await setupDatabase();
});

after(async () => {
  await teardownDatabase();
});

beforeEach(async () => {
  await cleanDatabase();
});

async function cleanDatabase() {
  await Promise.all([cleanCollection(Example)]);
}
