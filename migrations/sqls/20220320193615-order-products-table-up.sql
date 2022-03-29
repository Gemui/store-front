CREATE TABLE order_products (
    order_id integer REFERENCES orders(id) ON DELETE CASCADE not null,
    product_id integer REFERENCES products(id) ON DELETE CASCADE not null,
    product_price float not null,
    product_quantity float not null
);