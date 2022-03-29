import Client from "../database";
import Order from "../types/order.type";
import OrderProduct from "../types/orderProducts.type";
import OrderStatus from "../enums/orderStatus.enum";
import Product from "../types/product.type";
import { Model } from "./model";
import { ProductStore } from "./product.model";

const productStore = new ProductStore();

export class OrderStore extends Model {

    tableName = 'orders';

    async create(order : Order, orderProducts: OrderProduct[]): Promise<Order|void> {

        try {

            const conn = await Client.connect();
            const orderQuery = await Client.query(`insert into ${this.tableName}
             (user_id) values ( ($1) ) returning *`,
            [order.user_id]);

            const orderData = orderQuery.rows[0] as Order;
            const createdProducts: Array<OrderProduct> = [];


            for(var i = 0;i<orderProducts.length;i++) { 

                let orderProduct = orderProducts[i];
                const databaseProduct = await productStore.getByColumn('id', orderProduct.product_id) as unknown as Product;

                let insertedProduct = (await Client.
                query('insert into order_products (order_id, product_id, product_quantity, product_price) values ( ($1), ($2), ($3), ($4) ) returning *',
                [orderData.id, orderProduct.product_id, orderProduct.product_quantity, databaseProduct.price])).rows[0] as unknown as OrderProduct

                createdProducts.push( insertedProduct );
             }


            conn.release();
        
            orderData['orderProducts'] = createdProducts;
            return  orderData;
    

        } catch(e) {
            throw new Error(`unable to create order with error : ${(e as Error).message}`)

        }


    };

    async completeOrder(orderId : number): Promise<void> {

        try {

            const conn = await Client.connect();
            await Client.query(`update ${this.tableName} set status =  ($1) where id = ($2)`,[OrderStatus.completed, orderId]);
            conn.release();


        } catch(e) {
            throw new Error(`unable to complete order with error : ${(e as Error).message}`)

        }


    };
    

    async getUserOrders(user_id : number, status : OrderStatus|null = null): Promise<Order[]> {

        try {

            const conn = await Client.connect();
            const queryData: Array<number|OrderStatus> = [user_id];
            let clientQuery = `select * from orders where user_id = ($1)`;

            if (status) {
                clientQuery +=  'and status = ($2)';
                queryData.push(status);
            }
            
            const userOrders = await Client.query(clientQuery,queryData);

            conn.release();

            return userOrders.rows;

        } catch(e) {
            throw new Error(`unable to getUserOrders with error : ${(e as Error).message}`)

        }


    };
    

    
    async getOrderDetails(order_id : number): Promise<Order> {

        try {
            const conn = await Client.connect();
            const order = await this.getByColumn('id',order_id) as unknown as Order;
            order.orderProducts = (await conn.query('select * from order_products where order_id = ($1)',[order.id])).rows as unknown as OrderProduct[];
            conn.release();

            return order;

        } catch(e) {
            throw new Error(`unable to getOrderDetails with error : ${(e as Error).message}`)

        }


    };
    




}


