import supertest from "supertest";
import Client from "../../database";
import { Model } from "../../models/model";
import { UserStore } from "../../models/user.model";
import app from "../../server";
import User from "../../types/user.type";

class TestModel extends Model {

    protected tableName = 'users';

}
const userModel = new UserStore()
const request = supertest(app)
const testModel = new TestModel();
describe('Test Abstract Model', () => {

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
            it('should have method getAll in model class', () => {

                expect(testModel.getAll).toBeDefined();
        
            });

            it('should have method getByColumn in model class', () => {

                expect(testModel.getByColumn).toBeDefined();
        
            });


            it('should have method getManyByColumn in model class',  () => {

                expect(testModel.getManyByColumn).toBeDefined();
        
            });
        })


        describe('Test Model methods logic', () => {
            
            it('should have method getAll as return many of child class', async () => {

                    const isGetAll = await testModel.getAll() as User[];

                    expect(isGetAll.length).toEqual(1);
                    expect(isGetAll[0].id).toEqual(user.id);
                    expect(isGetAll[0].username).toEqual(user.username);
                    expect(isGetAll[0].firstname).toEqual(user.firstname);
                    expect(isGetAll[0].lastname).toEqual(user.lastname);

                });


                it('should have method getByColumn as return one recored of child class ', async () => {

                    const isGetByColumn = await testModel.getByColumn('id',Number(user.id)) as User;
                    expect(isGetByColumn.id).toEqual(user.id);
                    expect(isGetByColumn.username).toEqual(user.username);
                    expect(isGetByColumn.firstname).toEqual(user.firstname);
                    expect(isGetByColumn.lastname).toEqual(user.lastname);
                });


                it('should have method getManyByColumn as return many recored of child class ', async () => {

                    const isGetManyByColumn = await testModel.getManyByColumn('id',Number(user.id)) as User[];
                    // expect(isGetManyByColumn[0]).toEqual(user);
                    expect(isGetManyByColumn[0].id).toEqual(user.id);
                    expect(isGetManyByColumn[0].username).toEqual(user.username);
                    expect(isGetManyByColumn[0].firstname).toEqual(user.firstname);
                    expect(isGetManyByColumn[0].lastname).toEqual(user.lastname);
                    expect(isGetManyByColumn.length).toEqual(1);

                });

        })




})