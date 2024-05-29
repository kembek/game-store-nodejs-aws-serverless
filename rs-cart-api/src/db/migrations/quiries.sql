CREATE DATABASE game_store_db encoding=UTF8;

CREATE TYPE status as enum ('OPEN', 'ORDERED');

CREATE TABLE IF NOT EXISTS cart_items (
	cart_id uuid PRIMARY KEY NOT NULL,
	product_id uuid NOT NULL,
	count integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS carts (
	id uuid PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	"status" status NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
	id uuid PRIMARY KEY NOT NULL,
	user_id uuid NOT NULL,
	cart_id uuid NOT NULL,
	payment json,
	delivery json,
	comments text,
	"status" text,
	total numeric(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
	id uuid PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL
);

ALTER TABLE "cart_items" 
  ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" 
  FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "carts" 
  ADD CONSTRAINT "carts_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "orders" 
  ADD CONSTRAINT "orders_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "orders" 
  ADD CONSTRAINT "orders_cart_id_carts_id_fk" 
  FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE cascade ON UPDATE no action;

INSERT INTO users (id, name, email, password) VALUES ('1cf4746b-4e94-4616-8dec-36db8b976401', 'Kembek', 'Kembek@gmail.com', '1234qwer');

INSERT INTO carts (id, user_id, status) VALUES ('9fa15430-a976-47f2-b9db-be5b2d837c15', '1cf4746b-4e94-4616-8dec-36db8b976401', 'OPEN');

INSERT INTO cart_items (cart_id, product_id, count) VALUES ('9fa15430-a976-47f2-b9db-be5b2d837c15', '7567ec4b-b10c-48c5-9345-fc73c48a80aa', 2);

INSERT INTO orders (id, user_id, cart_id, payment, delivery) VALUES 
('032c48fb-ab29-4082-b852-92022a60e41f', '1cf4746b-4e94-4616-8dec-36db8b976401', '9fa15430-a976-47f2-b9db-be5b2d837c15', '{ "payment": "VISA" }', '{ "address": "Earth" }');

