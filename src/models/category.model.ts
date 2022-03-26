import Client from "../database";
import Category from "../types/category.type";
import { Model } from "./model";



export class CategoryStore extends Model {

    tableName = 'categories';

    async create(category : Category): Promise<Category|undefined> {

        try {

            const conn = await Client.connect();
    
            const userQuery = await Client.query(`insert into ${this.tableName} (name) values ( ($1) ) returning *`,
            [category.name]);

            conn.release();
            return  userQuery.rows[0] as Category;
    

        } catch(e) {
            throw new Error(`unable to create category with error : ${(e as Error).message}`)

        }


    };



}


