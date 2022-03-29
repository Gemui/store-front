import supertest from "supertest";
import Client from "../../database";
import { Model } from "../../models/model";
import { UserStore } from "../../models/user.model";
import app from "../../server";
import User from "../../types/user.type";

const userModel = new UserStore()
const request = supertest(app)
describe('Test User Model', () => {

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
        connection.release()
        })


        describe('Test Methods exists', () => {
            it('should have method authenticate in user class', () => {

                expect(userModel.authenticate).toBeDefined();
        
            });

            it('should have method create in user class', () => {

                expect(userModel.create).toBeDefined();
        
            });
        })


        describe('Test Model methods logic', () => {
            
            it('should authenticate user data and return all user info', async () => {

                    const isUserAutencticated = await userModel.authenticate(user.username, user.password) as User;
                    expect(isUserAutencticated.id).toEqual(user.id);
                    expect(isUserAutencticated.username).toEqual(user.username);
                    expect(isUserAutencticated.firstname).toEqual(user.firstname);
                    expect(isUserAutencticated.lastname).toEqual(user.lastname);

                });



        })




})