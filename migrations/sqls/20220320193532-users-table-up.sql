CREATE TABLE users (id SERIAL PRIMARY KEY,
 username varchar(100) not null,
  password varchar(100) not null,
  firstName varchar(70) not null,
  lastName varchar(70) not null
  );

ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);