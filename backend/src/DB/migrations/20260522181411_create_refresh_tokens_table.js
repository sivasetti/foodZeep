/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.dropTableIfExists('refresh_tokens');
    return knex.schema.createTable('refresh_tokens', (table) =>{
        table.increments('id').primary();
        table.specificType('user_id', 'INT').notNullable();

        table.string('token', 500).notNullable().unique();

        table.timestamp('expires_at').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());

        //clean cascades if a user profile gets removed
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {

    return knex.schema.dropTableIfExists('refresh_tokens');

};
