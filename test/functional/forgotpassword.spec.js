const { test, trait } = use('Test/Suite')('Forgot Password');

const { subHours, format } = require('date-fns');

const Mail = use('Mail')
const Hash = use('Hash')
const Database = use('Database')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should and email with reset password instruction', async ({ assert, client }) => {
  Mail.fake();

  const email = 'inmob.comercial@gmail.com';

  const user = await Factory.model('App/Models/User').create({ email });

  await client
    .post('/forgot')
    .send({ email })
    .end();

  const token = await user.tokens().first();

  const recentEmail = Mail.pullRecent();

  console.log(token)

  assert.equal(recentEmail.message.to[0].address, email);

  assert.include(token.toJSON(), {
    type: 'forgotpassword',
  });
  Mail.restore();
});

//cham auma rota tipo: /reset (token, senha nova, confirmacao, senha precisa mudar)
//ele só vai resetar se o tolken tiver sido criado a menos de 2h

test('it should be able to reset passwords', async ({ assert, client }) => {
  const email = 'inmob.comercial@gmail.com';

  const user = await Factory.model('App/Models/User').create({ email });
  const userToken = await Factory.model('App/Models/Token').make();

  await user.tokens().save(userToken);

  const response = await client
    .post('/reset')
    .send({
      token: userToken.token,
      password: '123456',
      password_confirmation: '123456'

    })
    .end()

  response.assertStatus(204);

  await user.reload();
  const checkPassword = await Hash.verify('123456', user.password);

  assert.isTrue(checkPassword);

});

// Email deve ter duração de até 2horas para o usuário alterar
test('não pode redefinir a senha após 2h de solicitação de senha esquecida.', async ({
  client }) => {
  const email = 'inmob.comercial@gmail.com';

  const user = await Factory.model('App/Models/User').create({ email });
  const userToken = await Factory.model('App/Models/Token').make();

  await user.tokens().save(userToken);

  const dateWithSub = format(subHours(new Date(), 2), 'yyyy-MM-dd HH:ii:ss');

  await Database.table('tokens')
    .where('token', userToken.token)
    .update('created_at', dateWithSub);

  await userToken.reload();

  const response = await client
    .post('/reset')
    .send({
      token: userToken.token,
      password: '123456',
      password_confirmation: '123456',

    })
    .end()

  response.assertStatus(400);

});


