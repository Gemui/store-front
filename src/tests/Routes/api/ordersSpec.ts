import supertest from "supertest"
import Client from "../../../database"
import OrderStatus from "../../../enums/orderStatus.enum"
import { CategoryStore } from "../../../models/category.model"
import { OrderStore } from "../../../models/order.model"
import { ProductStore } from "../../../models/product.model"
import { UserStore } from "../../../models/user.model"
import app from "../../../server"
import Category from "../../../types/category.type"
import Order from "../../../types/order.type"
import OrderProduct from "../../../types/orderProducts.type"
import Product from "../../../types/product.type"
import User from "../../../types/user.type"


const userModel = new UserStore()
const categoryStore = new CategoryStore()
const productStore = new ProductStore()
const orderStore = new OrderStore()
const request = supertest(app)
let userToken = '';
describe('Products End Point', () => {

    const user = {
        username : 'username',
        password : 'userpassword',
        firstName : 'first',
        lastName : 'second'
    } as User;
    const product = {
        name : 'product-0',
        price : 15,

       } as Product
    
    let categoryData : Category;
    let productsData : Product[] = [];
    beforeAll(async () => {
        const createdUser = await userModel.create(user)
        user.id = createdUser.id;
        const result = await request.post('/api/users/login').set('Content-type', 'application/json').send({
            username: user.username,
            password: user.password,
          })
          userToken = result.body.token;
        categoryData = (await categoryStore.create({'name' : 'category-1'}) as unknown) as Category;
        if (categoryData.id) {
            product.category_id = categoryData.id;
        }
        
        productsData.push( await productStore.create(product) as Product )
        product.name = 'product-10';
        productsData.push( await productStore.create(product) as Product )
        console.log(productsData);
        })

    afterAll(async () => {
    // clean db
    const connection = await Client.connect()
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM products');
    connection.release()
    })


    describe('Test Crud routes', () => {

        it('Test get user orders with wrong user_id 422 with error ', async () => {

            for (let i = 1; i <= 5; i++){

                const result = await request
                .get('/api/orders/500000000')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`)
                expect(result.status).toBe(422);
                expect(result.body.errors[0].param).toEqual('user_id');
                expect(result.body.errors[0].msg).toEqual('user_id 500000000 not valid');
        
            }

        });


        it('Test get user orders details should return all orders of user with status 200', async () => {

               const order = await orderStore.create({
                user_id : user.id,
                status : OrderStatus.active,

               } as Order, [ {
                product_id : productsData[0].id,
                product_price : 10,
                product_quantity : 5
            } as OrderProduct] ) as Order


            const result = await request
            .get(`/api/orders/${user.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToken}`)
            expect(result.status).toBe(200)
            expect(result.body.status).toEqual('success')
            expect(result.body.data[0].category_id).toEqual(categoryData.id)
            expect(result.body.data.price).toEqual(15)
            expect(result.body.data.name).toEqual('product-0')
        

        });


            it('Test get product details with wrong product_id', async () => {

                const result = await request
                .get(`/api/orders/500000000`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`)
                expect(result.status).toBe(403)
                expect(result.body.status).toEqual('failed')

        });


        it('Test create many orders should return 200 with category every create', async () => {

            for (let i = 1; i <= 5; i++){
                let productName = `product-${i}`
                let randomPrice = (i + 1) * 2;
                const result = await request
                .post('/api/orders/create')
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

        it('should list all products with count 6', async () => {
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