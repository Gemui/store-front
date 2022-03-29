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
describe('Orders Routes', () => {

    const user = {
        username : 'username',
        password : 'userpassword',
        firstname : 'first',
        lastname : 'second'
    } as User;
    const product = {
        name : 'product-0',
        price : 15,

       } as Product
    
       const order = {
        user_id : user.id,
        status : OrderStatus.active,

       } as Order;
    let categoryData : Category;
    let productsData : Product[] = [];


    beforeAll(async (): Promise<void> => {
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

        order.user_id = user.id as number
        const orderResult = await orderStore.create( order, [ {
            product_id : productsData[0].id,
            product_price : 10,
            product_quantity : 5
        } as OrderProduct] ) as Order
        order.id = orderResult.id;

        })

    afterAll(async (): Promise<void> => {
    // clean db
    const connection = await Client.connect()
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM order_products');
    connection.release()
    })


    describe('Test Crud routes', () => {

        it('Test get user orders with wrong user_id 422 with error ', async (): Promise<void> => {

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


        it('Test get user orders should return all orders of user with status 200', async (): Promise<void> => {

               


            const result = await request
            .get(`/api/orders/${user.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToken}`)
            expect(result.status).toBe(200)
            expect(result.body.status).toEqual('success')
            expect(result.body.data[0].id).toEqual(order.id)
            expect(result.body.data[0].status).toEqual(order.status)
            expect(result.body.data[0].user_id).toEqual(user.id)
        

        });

        it('Test create many orders should return 200 with order_details every create', async (): Promise<void> => {

            productsData = productsData.map((value) => {
                return {...value, ...{product_quantity : '2', product_id : value.id }}
            })

            const result = await request
            .post('/api/orders/create')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToken}`).send({
                user_id : user.id,
                products : productsData
                })
            expect(result.status).toBe(200)
            expect(result.body.data.status).toEqual(OrderStatus.active)
            expect(result.body.data.user_id).toEqual(user.id)
            expect(result.body.data.orderProducts.length).toEqual(productsData.length)

        });


        it('should get order details and order products with status 200', async (): Promise<void> => {
            const result = await request
            .get(`/api/orders/${order.id}/details`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToken}`)
            const orderData = result.body.data;
            expect(result.status).toBe(200)
            expect(result.body.status).toEqual('success')
            expect(orderData.user_id).toEqual(user.id);
            expect(orderData.orderProducts[0].order_id).toEqual(order.id);
        });

        it('Test complete order should return updated and update database', async (): Promise<void> => {
            const result = await request
            .post(`/api/orders/${order.id}/complete`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToken}`)

            expect(result.status).toBe(200);
            expect(result.body.status).toEqual('success');

            const createdOrder = await orderStore.getByColumn('id',Number(order.id)) as Order;

            expect(createdOrder.user_id).toEqual(Number(user.id));
            expect(createdOrder.status).toEqual(OrderStatus.completed);
            if(createdOrder.orderProducts) {
                expect(createdOrder.orderProducts[0].order_id).toEqual(Number(order.id));
            }
        
        });

    })
})