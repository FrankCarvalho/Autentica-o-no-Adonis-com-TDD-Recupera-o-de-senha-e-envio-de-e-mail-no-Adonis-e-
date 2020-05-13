const { test, trait } = use('Test/Suite')('Workshop');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Workshop = use('App/Models/Workshop');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

test('it should be able to create workshops', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .post('/workshops')
    .loginVia(user, 'jwt')
    .send({
      title: 'Utilizando Node.js para construir APIs seguras e performáticas',
      description: 'O Node.js tem design semelhante e é influenciado por sistemas como Ruby Event Machine e Twisted, do Python . O Node.js leva o modelo de evento um pouco mais longe',
      user_id: user.id,
      section: 1,
    })
    .end();

  response.assertStatus(201);
  assert.exists(response.body.id);
});

/**
 * Listagem de worksops
 */

test('deve poder listar oficinas.', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').make({
    section: 2,
  });

  await user.workshops().save(workshop);

  const response = await client
    .get('/workshops')
    .query({ section: 2 })
    .loginVia(user, 'jwt')
    .end();


  response.assertStatus(200);

  assert.equal(response.body[0].title, workshop.title);
  assert.equal(response.body[0].user.id, user.id);
});

/**
 * Edição de worksops
 */

test('Deve poder mostrar o único workshop.', async ({ assert, client }) => {

  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();

  await user.workshops().save(workshop);

  const response = await client
    .get(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .end();


  response.assertStatus(200);

  assert.equal(response.body.title, workshop.title);
  assert.equal(response.body.user.id, user.id);
});

test('it should be able to update a workshop.', async ({ assert, client }) => {

  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create({
    title: 'Old Title',
  });

  await user.workshops().save(workshop);

  const response = await client
    .put(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .send({
      ...workshop.toJSON(),
      title: 'New Title',
    })
    .end();


  response.assertStatus(200);

  assert.equal(response.body.title, 'New Title');
});

test('it should be able to delete a workshop.', async ({ assert, client }) => {

  const user = await Factory.model('App/Models/User').create();
  const workshop = await Factory.model('App/Models/Workshop').create();

  await user.workshops().save(workshop);

  const response = await client
    .delete(`/workshops/${workshop.id}`)
    .loginVia(user, 'jwt')
    .end();


  response.assertStatus(204);

  const checkworkshop = await Workshop.find(workshop.id);

  assert.isNull(checkworkshop);
});
