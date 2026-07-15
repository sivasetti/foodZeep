/**
 * Migration: Create carts and cart_items tables
 *
 * carts
 *   - One active cart per user (enforced by UNIQUE on user_id)
 *   - status tracks lifecycle: active → ordered / abandoned
 *   - updated_at enables 24h inactivity expiration checks
 *
 * cart_items
 *   - Links food items to a cart with quantity and special instructions
 *   - Unique constraint on (cart_id, food_id) prevents duplicate entries
 *   - CASCADE deletes propagate from carts → cart_items → removed food_items
 */

exports.up = async function (knex) {
  await knex.schema.createTable('carts', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('status', 20).notNullable().defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('status', 'idx_carts_status');
  });

  await knex.schema.createTable('cart_items', (table) => {
    table.increments('id').primary();
    table
      .integer('cart_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('carts')
      .onDelete('CASCADE');
    table
      .integer('food_id')
      .notNullable()
      .references('id')
      .inTable('food_items')
      .onDelete('CASCADE');
    table.integer('quantity').notNullable().defaultTo(1);
    table.string('special_instructions', 500).nullable().defaultTo(null);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('cart_id', 'idx_cart_items_cart_id');
    table.index('food_id', 'idx_cart_items_food_id');
    table.unique(['cart_id', 'food_id'], {
      indexName: 'uq_cart_items_cart_food',
    });
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('cart_items');
  await knex.schema.dropTableIfExists('carts');
};
