// Update with your config settings.
require('dotenv').config();

module.exports = {

  // development: {
    client: 'mysql',
    connection: {
      host: process.env.APP_HOST || 'localhost',
      port: process.env.APP_PORT || 3306,
      database: process.env.APP_DB || 'test_schema',
      user:     process.env.APP_USER || 'root',
      password: process.env.APP_PASSWORD || ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
    // migrations: {
    //   tableName: 'knex_migrations'
    // }
  // }
};
