import supertest from "supertest"
import Client from "../../../database"
import { CategoryStore } from "../../../models/category.model"
import { ProductStore } from "../../../models/product.model"
import { UserStore } from "../../../models/user.model"
import app from "../../../server"
import Category from "../../../types/category.type"
import Product from "../../../types/product.type"
import User from "../../../types/user.type"


const userModel = new UserStore()
const categoryStore = new CategoryStore()
const productStore = new ProductStore()
const request = supertest(app)
let userToken = '';
describe('Products End Point', () => {

    const user = {
        username : 'username',
        password : 'userpassword',
        firstname : 'first',
        lastname : 'second'
    } as User;
    let categoryData : Category;
    beforeAll(async (): Promise<void> => {
        const createdUser = await userModel.create(user)
        user.id = createdUser.id;
        const result = await request.post('/api/users/login').set('Content-type', 'application/json').send({
            username: user.username,
            password: user.password,
          })
          userToken = result.body.token;
        categoryData = await categoryStore.create({'name' : 'category-1'}) as unknown as Category;
        })

    afterAll(async (): Promise<void> => {
    // clean db
    const connection = await Client.connect()
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM products');
    connection.release()
    })


    describe('Test Crud routes', () => {

        it('Test create with missing required data should return 422 with error ', async (): Promise<void> => {

            for (let i = 1; i <= 5; i++){

                const result = await request
                .post('/api/products/create')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`)
                
                expect(result.status).toBe(422);
                expect(result.body.errors[0].param).toEqual('name');
                expect(result.body.errors[0].msg).toEqual('name should be exists and not empty');
        
            }

        });


        it('Test get product details should return excat product data with status 200', async (): Promise<void> => {

               const createdProduct = await productStore.create({
                name : 'product-0',
                category_id : categoryData.id,
                price : 15,

               } as Product ) as Product
                const result = await request
                .get(`/api/products/${createdProduct.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`)
                expect(result.status).toBe(200)
                expect(result.body.status).toEqual('success')
                expect(result.body.data.category_id).toEqual(categoryData.id)
                expect(result.body.data.price).toEqual(15)
                expect(result.body.data.name).toEqual('product-0')
            

        });


            it('Test get product details with wrong product_id', async (): Promise<void> => {

                const result = await request
                .get(`/api/products/500000000`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`)
                expect(result.status).toBe(403)
                expect(result.body.status).toEqual('failed')

        });


        it('Test create many products should return 200 with category every create', async (): Promise<void> => {

            for (let i = 1; i <= 5; i++){
                let productName = `product-${i}`
                let randomPrice = (i + 1) * 2;
                const result = await request
                .post('/api/products/create')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`).send({
                    name : productName,
                    category_id : categoryData.id,
                    price : randomPrice,
                 })
                expect(result.status).toBe(200)
                expect(result.body.status).toEqual('success')
                expect(result.body.data.category_id).toEqual(categoryData.id)
                expect(result.body.data.price).toEqual(randomPrice)
                expect(result.body.data.name).toEqual(productName)
            }

        });

        it('should list all products with count 6', async (): Promise<void> => {
            const result = await request
            .get('/api/products')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToken}`)
            const productData = result.body.data as Category[];
            expect(result.status).toBe(200)
            expect(result.body.status).toEqual('success')
            expect(productData.length).toEqual(6);

        });

    })
})