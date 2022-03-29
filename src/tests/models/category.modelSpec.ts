import supertest from "supertest";
import Client from "../../database";
import { CategoryStore } from "../../models/category.model";
import { Model } from "../../models/model";
import { UserStore } from "../../models/user.model";
import app from "../../server";
import Category from "../../types/category.type";
import User from "../../types/user.type";

const userModel = new UserStore()
const categoryModel = new CategoryStore()
const request = supertest(app)
describe('Test category Model', () => {

    const user = {
        username : 'username',
        password : 'userpassword',
        firstname : 'first',
        lastname : 'second'
    } as User;

    beforeAll(async (): Promise<void> => {
        const createdUser = await userModel.create(user);
        user.id = createdUser.id;
        })


    afterAll(async (): Promise<void> => {
        // clean db
        const connection = await Client.connect()
        await connection.query('DELETE FROM users');
        await connection.query('DELETE FROM categories');
        connection.release()
        })


        describe('Test Methods exists', () => {


            it('should have method create in category class', () => {

                expect(categoryModel.create).toBeDefined();
        
            });
        })


        describe('Test Model methods logic', () => {

            it('should create category and return', async () => {

                    const isCreatedCategory = await categoryModel.create({name : 'category-test'}) as Category;
                    expect(isCreatedCategory.name).toEqual('category-test');
                });



        })




})