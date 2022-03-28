CREATE TABLE products (id SERIAL PRIMARY KEY,
 category_id integer REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(70) not null,
  price integer not null
  );