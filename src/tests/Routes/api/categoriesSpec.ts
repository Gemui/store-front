import supertest from "supertest"
import Client from "../../../database"
import { CategoryStore } from "../../../models/category.model"
import { UserStore } from "../../../models/user.model"
import app from "../../../server"
import Category from "../../../types/category.type"
import User from "../../../types/user.type"


const userModel = new UserStore()
const categoryStore = new CategoryStore()
const request = supertest(app)
let userToken = '';
describe('categories End Point', () => {

    const user = {
        username : 'username',
        password : 'userpassword',
        firstName : 'first',
        lastName : 'second'
    } as User;

    beforeAll(async (): Promise<void> => {
        const createdUser = await userModel.create(user)
        user.id = createdUser.id;
        const result = await request.post('/api/users/login').set('Content-type', 'application/json').send({
            username: user.username,
            password: user.password,
          })
          userToken = result.body.token;

        })

    afterAll(async (): Promise<void> => {
    // clean db
    const connection = await Client.connect()
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM categories');
    connection.release()
    })


    describe('Test Crud routes', () => {

        it('Test create with missing required data should return 422 with error ', async (): Promise<void> => {

            for (let i = 1; i <= 5; i++){

                const result = await request
                .post('/api/categories/create')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`)

                expect(result.status).toBe(422);
                expect(result.body.errors[0].param).toEqual('name');
                expect(result.body.errors[0].msg).toEqual('category name is required');
        
            }

        });

        it('Test create many categories should return 200 with category every create', async (): Promise<void> => {

            for (let i = 1; i <= 5; i++){
                let categoryName = `category-${i}`
                const result = await request
                .post('/api/categories/create')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`).send({
                    name : categoryName,
                 })
                expect(result.status).toBe(200)
                expect(result.body.status).toEqual('success')
                expect(result.body.data.name).toEqual(categoryName)
            }

        });

        it('should list all categories with count 5', async (): Promise<void> => {
            const result = await request
            .get('/api/categories')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToken}`)
            const categoryData = result.body.data as Category[];
            expect(result.status).toBe(200)
            expect(result.body.status).toEqual('success')
            expect(categoryData.length).toEqual(5);

        });

    })
})