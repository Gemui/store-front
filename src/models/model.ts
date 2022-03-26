
import Client from "../database";


export abstract class Model {
    
    protected abstract tableName : string;

    async getAll(): Promise<Array<{}>|null|undefined> {

        try {

            const conn = await Client.connect();
    
            const userQuery = await Client.query(`select * from  ${this.tableName}`);
            conn.release();
            if(userQuery.rows.length) {
                return  userQuery.rows;
            }
    
            return null;

        } catch(e) {
            throw new Error(`unable to select from ${this.tableName} using getAll  error : ${(e as Error).message}`)
        }


    };

    async getByColumn(column : String, value : String|number, operator = '='): Promise<{}|null|undefined> {

        try {

            const conn = await Client.connect();
            const userQuery = await Client.query(`select * from  ${this.tableName} where ${column} ${operator} ($1)`,[value]);

            conn.release();
            if(userQuery.rows.length) {
                return  userQuery.rows[0];
            }
    
            return null;

        } catch(e) {
            throw new Error(`unable to getByColumn from ${this.tableName} using getByColumn  error : ${(e as Error).message}`)
        }


    };


    async getManyByColumn(column : String, value : String|number, operator = '='): Promise<{}|null|undefined> {

        try {

            const conn = await Client.connect();
            const userQuery = await Client.query(`select * from  ${this.tableName} where ${column} ${operator} ($1)`,[value]);

            conn.release();
            if(userQuery.rows.length) {
                return  userQuery.rows;
            }
    
            return null;

        } catch(e) {
            throw new Error(`unable to getByColumn from ${this.tableName} using getByColumn  error : ${(e as Error).message}`)
        }


    };



}