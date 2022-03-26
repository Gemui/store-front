import Client from "../database";
import Product from "../types/product.type";
import { Model } from "./model";



export class ProductStore extends Model {

    tableName = 'products';

    async create(product : Product): Promise<Product|undefined> {

        try {

            const conn = await Client.connect();
    
            const userQuery = await Client.query(`insert into ${this.tableName}
             (name, category_id, price) values ( ($1) ,($2), ($3) ) returning *`,
            [product.name, product.category_id, product.price]);

            conn.release();
            return  userQuery.rows[0] as Product;
    

        } catch(e) {
            throw new Error(`unable to create product with error : ${(e as Error).message}`)

        }


    };




    async topProducts(limit: number): Promise<Product[]|undefined> {

        try {

            const conn = await Client.connect();
            //TODO write query to top dynamic limit
            const userQuery = await Client.query(`select * from  ${this.tableName} `);

            conn.release();
            return  userQuery.rows;
    

        } catch(e) {
            throw new Error(`unable to create product with error : ${(e as Error).message}`)

        }


    };


}


