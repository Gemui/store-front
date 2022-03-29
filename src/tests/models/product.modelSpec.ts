import supertest from "supertest";
import Client from "../../database";
import { CategoryStore } from "../../models/category.model";
import { Model } from "../../models/model";
import { ProductStore } from "../../models/product.model";
import { UserStore } from "../../models/user.model";
import app from "../../server";
import Category from "../../types/category.type";
import Product from "../../types/product.type";
import User from "../../types/user.type";

const userModel = new UserStore()
const categoryModel = new CategoryStore()
const productModel = new ProductStore()
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


    beforeAll(async (): Promise<void> => {
        const createdUser = await userModel.create(user);
        user.id = createdUser.id;
        const createdCategory = await categoryModel.create(category) as Category;
        category.id = createdCategory.id;


        });

    afterAll(async (): Promise<void> => {
        // clean db
        const connection = await Client.connect()
        await connection.query('DELETE FROM users');
        await connection.query('DELETE FROM categories');
        await connection.query('DELETE FROM products');
        connection.release()
        })


        describe('Test Methods exists', () => {


            it('should have method create in category class', () => {

                expect(productModel.create).toBeDefined();
        
            });


            it('should have method getProductWithCategoryExists in category class', () => {

                expect(productModel.getProductWithCategoryExists).toBeDefined();
        
            });
            
            
        })


        describe('Test Model methods logic', () => {

            it('should create category and return category info', async () => {

                    const isCreatedProduct = await productModel.create({
                        name : 'product-test',
                        category_id : Number(category.id),
                        price :15,
                    }) as Category;


                    expect(isCreatedProduct.name).toEqual('product-test');
                });

                it('should get productcs by category id ', async () => {

                    const isCreatedProduct = await productModel.getProductWithCategoryExists(category.id) as Product[];

                    expect(isCreatedProduct[0].name).toEqual('product-test');
                    expect(isCreatedProduct[0].price).toEqual(15);
                    expect(isCreatedProduct[0].category_id).toEqual(Number(category.id));
                });


                it('should return empty with topProducts', async () => {

                    const isCreatedProduct = await productModel.topProducts(category.id) as Product[];

                    expect(isCreatedProduct.length).toEqual(0);
                });

        })




})