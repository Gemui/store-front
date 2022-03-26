CREATE TABLE categories (
id SERIAL PRIMARY KEY,
name varchar(70) );


ALTER TABLE categories ADD CONSTRAINT unique_name UNIQUE (name);