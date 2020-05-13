const { ServiceProvider } = require('@adonisjs/fold')

class CustomValidationProvider extends ServiceProvider {
  /**
  * data -> são os dados que eu consigo acessar através do insomina
  * field -> qual campo esta sendo validado 
  * message --> mensagem de validação
  * args -> são todos os argumentos
  * get -> 
  */
  async existsFn (data, field, message, args, get) {
    const Database = use('Database');

    const value = get(data, field)
    if (!value) {
      return
    }

    const [table, column] = args;

    const row = await Database.table(table)
    .where(column, value)
    .first();

    if (!row) {
      throw message
    }
  }

/**
 * @method
 * 
 * @return {void}
 */

  boot () {
    const Validator = use('Validator')

    Validator.extend('exists', this.existsFn.bind(this));
  }
}

module.exports = CustomValidationProvider;
