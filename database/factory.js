
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker, i, data = {}) => {
  return {
    name: faker.name(),
    title: 'CTO - INMOB',
    email: faker.email(),
    password: faker.string(),
    ...data
  };
});

Factory.blueprint('App/Models/Token', (faker, i, data = {}) => {
  return {
    type: data.type || 'refereshtoken',
    token: faker.string({ length: 20 }),
    ...data
  };
});

Factory.blueprint('App/Models/Workshop', (faker, i, data = {}) => {
  return {
    title: faker.sentence({ words: 7 }),
    description: faker.paragraph(),
    section: faker.integer({ min: 1, max: 3 }), 
    ...data,        
  };
});

