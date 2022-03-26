CREATE TABLE orders (id SERIAL PRIMARY KEY,
 user_id integer REFERENCES users(id),
  status VARCHAR(15) CHECK (status in ('active','completed'))  not null
  );
alter table orders alter column status set default 'active';