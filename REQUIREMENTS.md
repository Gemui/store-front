# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index `/api/products [GET]`
- Show `/api/products/:id [GET]`
- Create [token required] `/api/products/create [POST]`
- [OPTIONAL] Top 5 most popular products `/api/products/top [GET]`
- [OPTIONAL] Products by category (args: product category) `/api/products [GET] params (category_id) `

#### Users

- Index [token required] `/api/users [GET]`
- Show [token required] `/api/users/:id [GET]`
- Create N[token required] `/api/users/register [POST]`
- Login `/api/users/login [POST]`

#### Orders

- Current Order by user (args: user id)[token required] `/api/orders/:user_id [GET]`
- CreateOrder `/api/orders/create[POST]`
- Complete Order `/api/orders/:id/complete [POST]`
- Order Details `/api/orders/:id/details [GET]`
- [OPTIONAL] Completed Orders by user (args: user id)[token required] `/api/orders/:user_id/filter [GET]  params (order_status) `

## Data Shapes

#### Category

- id `id SERIAL PRIMARY KEY`
- name `name varchar(70) not null`

#### Product

- id `id SERIAL PRIMARY KEY`
- name `username varchar(100) not null`
- price `integer not null`
- [OPTIONAL] category `category_id integer REFERENCES categories(id) ON DELETE CASCADE`

#### User

- id `id SERIAL PRIMARY KEY`
- firstname `firstname varchar(100) not null`
- lastname `lastname varchar(100) not null`
- username `username varchar(100) not null unique`
- password `password varchar(100) not null`

#### Orders

Table : `orders`

user_id `integer REFERENCES users(id) ON DELETE CASCADE`

  status `VARCHAR(15) CHECK (statusin ('active','completed'))  not null`

Table : `order_products`

- order_id `integer REFERENCES orders(id) ON DELETE CASCADE not null`
- product_id `integer REFERENCES products(id) ON DELETE CASCADE not null`
- product_quantity `float not null`
- product_price `float not null`
