const { TABLES } = require('../../utils/constants');

exports.up = function(knex) {
    return knex.schema.createTable(TABLES.transactions, table => {
        table.increments('id').primary();
        table.string('amount').notNull();
        table.datetime('date');        
        table.boolean('deleted').notNullable().defaultTo(false);
        table
            .integer('translator_id')
            .unsigned()
            .notNull()
            .references('id')
            .inTable(TABLES.users)
            .onUpdate('CASCADE');
        table
            .integer('client_id')
            .unsigned()
            .notNull()
            .references('id')
            .inTable(TABLES.users)
            .onUpdate('CASCADE');
        table
            .integer('service_id')
            .unsigned()
            .notNull()
            .references('id')
            .inTable(TABLES.translation_services)
            .onUpdate('CASCADE');    

        /* table
            .integer('token_id')
            .unsigned()
            .notNull()
            .references('token')
            .inTable(TABLES.paymentData)
            .onUpdate('CASCADE'); */

        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable(TABLES.transactions)
};
