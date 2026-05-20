/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  await knex.raw(`SET FOREIGN_KEY_CHECKS = 0`);

  await knex.raw(`
    --MASTER USERS TABLE
  CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  role varchar(20) DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--FOOD ITEMS TABLE
CREATE TABLE food_items (
  id int NOT NULL AUTO_INCREMENT,
  seller_id int NOT NULL,
  name varchar(100) NOT NULL,
  quantity int NOT NULL,
  veg tinyint(1) DEFAULT NULL,
  image_url varchar(255) DEFAULT NULL,
  price decimal(10,2) NOT NULL,
  expiry_time datetime NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_seller (seller_id),
  KEY idx_veg (veg),
  KEY idx_expiry (expiry_time),
  KEY idx_food_items_name (name),
  CONSTRAINT food_items_ibfk_1 FOREIGN KEY (seller_id) REFERENCES users (id)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--ORDERS TABLE
CREATE TABLE orders (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  seller_id int DEFAULT '4',
  total_amount decimal(10,2) DEFAULT NULL,
  status varchar(50) DEFAULT 'PLACED',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--ORDERS ITEMS TABLE
CREATE TABLE order_items (
  id int NOT NULL AUTO_INCREMENT,
  order_id int DEFAULT NULL,
  food_id int DEFAULT NULL,
  quantity int DEFAULT NULL,
  price decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 `);

  return knex.raw(`SET FOREIGN_KEY_CHECKS = 1;`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  await knex.raw(`SET FOREIGN_KEY_CHECKS = 0;`);
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('food_items');
  await knex.schema.dropTableIfExists('users');
  return knex.raw(`SET FOREIGN_KEY_CHECKS = 1;`);
};
