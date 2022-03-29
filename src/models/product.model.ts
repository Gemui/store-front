import { QueryResult } from 'pg'
import Client from '../database'
import Product from '../types/product.type'
import { Model } from './model'

export class ProductStore extends Model {
  tableName = 'products'

  async create(product: Product): Promise<Product | void> {
    try {
      const conn = await Client.connect()

      const userQuery = await Client.query(
        `insert into ${this.tableName}
             (name, category_id, price) values ( ($1) ,($2), ($3) ) returning *`,
        [product.name, product.category_id, product.price]
      )

      conn.release()
      return userQuery.rows[0] as Product
    } catch (e) {
      throw new Error(
        `unable to create product with error : ${(e as Error).message}`
      )
    }
  }

  async getProductWithCategoryExists(
    category_id: number | null = null
  ): Promise<Product[] | void> {
    try {
      const conn = await Client.connect()
      let productQuery = `select * from ${this.tableName} `
      let userQuery: QueryResult
      if (category_id) {
        productQuery += 'where category_id = ($1)'
        userQuery = await Client.query(productQuery, [category_id])
      } else {
        userQuery = await Client.query(productQuery)
      }

      conn.release()

      return userQuery.rows
    } catch (e) {
      throw new Error(
        `unable to create product with error : ${(e as Error).message}`
      )
    }
  }

  async topProducts(limit = 5): Promise<Product[] | void> {
    try {
      const conn = await Client.connect()

      const userQuery = await Client.query(
        `select p.*, sum(op.product_quantity) number_of_sale from  order_products op
                 inner join products p on op.product_id = p.id
                 group by p.id order by number_of_sale desc limit ($1)`,
        [limit]
      )

      conn.release()
      return userQuery.rows
    } catch (e) {
      throw new Error(
        `unable to get top product with error : ${(e as Error).message}`
      )
    }
  }
}
