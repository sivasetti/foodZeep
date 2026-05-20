/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('food_items', (table) => {
    // Add performance indices to your primary lookup columns
    table.index('name');
    table.index('seller_id');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('food_items', (table) =>{
    table.dropIndex('name');
    table.dropIndex('seller_id');
  });
};
