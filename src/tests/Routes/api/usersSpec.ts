import supertest from "supertest"
import Client from "../../../database"
import { UserStore } from "../../../models/user.model"
import app from "../../../server"
import User from "../../../types/user.type"


const userModel = new UserStore()
const request = supertest(app)
let userToken = '';
describe('User End Point', () => {

    const user = {
        username : 'username',
        password : 'userpassword',
        firstName : 'first',
        lastName : 'second'
    } as User;

    beforeAll(async () => {
        const createdUser = await userModel.create(user)
        user.id = createdUser.id;
        })

    afterAll(async () => {
    // clean db
    const connection = await Client.connect()
    await connection.query('DELETE FROM users');
    connection.release()
    })


    describe('test auth cycle', () => {
        it('should able to login and get token', async () => {
            const result = await request.post('/api/users/login').set('Content-type', 'application/json').send({
                username: user.username,
                password: user.password,
              })
              userToken = result.body.token;
              expect(result.status).toBe(200)
              expect(result.body.status).toEqual('success')
              expect(result.body.user.username).toBe(user.username);

        });

        it('try to login without send required data should return failed with 422 with error message', (done) => {
            request.post('/api/users/login').set('Content-type', 'application/json').send({
                username: 'wrong-username-should-not-exists',
              }).expect(422).then(response => {
                  expect(response.body.errors[0].param).toEqual('password');
                  expect(response.body.errors[0].msg).toEqual('Invalid password should be 6 character or more');
                  done();
              }).catch(error => console.log(error));

        });

        it('try access to wrong details should fail to login and return failed with 401', (done) => {
            request.post('/api/users/login').set('Content-type', 'application/json').send({
                username: 'wrong-username-should-not-exists',
                password: 'wrong-password'
              }).expect(401).then(response => {
                  expect(response.body.status).toEqual('failed');
                  done();
              }).catch(error => console.log(error));

        });

    });

    describe('Test Crud routes', () => {


        it('Test create many users', async () => {

            for (let i = 1; i < 5; i++){
                const result = await request
                .post('/api/users/register')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${userToken}`).send({
                    username : `${user.username}${i}`,
                    password : user.password,
                    firstName : user.firstName,
                    lastName : user.lastName,
                 })
                
                expect(result.status).toBe(200)
                expect(result.body.status).toEqual('success')
            }

        });

        it('should list all users with count 5', async () => {
            const result = await request
            .get('/api/users')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${userToken}`)
            const userData = result.body.data as User[];
            expect(result.status).toBe(200)
            expect(result.body.status).toEqual('success')
            expect(userData.length).toEqual(5);

        });

    })
})