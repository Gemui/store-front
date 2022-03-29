import supertest from "supertest";
import Client from "../../database";
import OrderStatus from "../../enums/orderStatus.enum";
import { CategoryStore } from "../../models/category.model";
import { Model } from "../../models/model";
import { OrderStore } from "../../models/order.model";
import { ProductStore } from "../../models/product.model";
import { UserStore } from "../../models/user.model";
import app from "../../server";
import Category from "../../types/category.type";
import Order from "../../types/order.type";
import OrderProduct from "../../types/orderProducts.type";
import Product from "../../types/product.type";
import User from "../../types/user.type";

const userModel = new UserStore()
const categoryModel = new CategoryStore()
const productModel = new ProductStore()
const orderModel = new OrderStore()
const request = supertest(app)
describe('Test category Model', () => {

    const user = {
        username : 'username',
        password : 'userpassword',
        firstname : 'first',
        lastname : 'second'
    } as User;
    const category = {
        name : 'category-test',
    } as Category;

    const product = {
        name : 'product-test',
        price :15,
    } as Product;

    let orderID : number;

    beforeAll(async (): Promise<void> => {
        const createdUser = await userModel.create(user);
        user.id = createdUser.id;
        const createdCategory = await categoryModel.create(category) as Category;
        category.id = createdCategory.id;

        product.category_id = Number(category.id);

        const createdProduct = await productModel.create(product) as Product;
        product.id = createdProduct.id;


        });

    afterAll(async (): Promise<void> => {
        // clean db
        const connection = await Client.connect()
        await connection.query('DELETE FROM users');
        await connection.query('DELETE FROM categories');
        await connection.query('DELETE FROM products');
        await connection.query('DELETE FROM orders');
        connection.release()
        })


        describe('Test Methods exists', () => {


            it('should have method create in order class', () => {

                expect(orderModel.create).toBeDefined();
        
            });


            it('should have method getProductWithCategoryExists in order class', () => {

                expect(orderModel.completeOrder).toBeDefined();
        
            });
            it('should have method getUserOrders in order class', () => {

                expect(orderModel.getUserOrders).toBeDefined();
        
            });
            it('should have method getOrderDetails in order class', () => {

                expect(orderModel.getOrderDetails).toBeDefined();
        
            });
            
            
        })


        describe('Test Model methods logic', () => {

            it('should create category and return category info', async () => {

                const isCreatedOrder = await orderModel.create({user_id : Number(user.id), status : OrderStatus.active } , [{
                    product_id : Number(product.id),
                    product_price : product.price,
                    product_quantity : 5
                } as OrderProduct]
                ) as Order;

                expect(isCreatedOrder.user_id).toEqual(Number(user.id));
                expect(isCreatedOrder.status).toEqual(OrderStatus.active);

                if(isCreatedOrder.orderProducts) {
                    expect(isCreatedOrder.orderProducts[0].order_id).toEqual(Number(isCreatedOrder.id));
                    expect(isCreatedOrder.orderProducts[0].product_id).toEqual(Number(product.id));
                    expect(isCreatedOrder.orderProducts[0].product_price).toEqual(product.price);
                    expect(isCreatedOrder.orderProducts[0].product_quantity).toEqual(5);
                }
                orderID = Number(isCreatedOrder.id)
                });

                it('should complete order ', async () => {

                    const completeOrder = await orderModel.completeOrder(orderID);
                    const isCompletedOrder = await orderModel.getByColumn('id',orderID) as Order;

                    expect(isCompletedOrder.status).toEqual(OrderStatus.completed);

                });


                it('should return all user orders by user_id', async () => {

                    const isUserOrders = await orderModel.getUserOrders(Number(user.id)) as Order[];

                    expect(isUserOrders.length).toEqual(1);
                });

        })




})