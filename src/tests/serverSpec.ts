import supertest from 'supertest'
import app from '../server'

const request = supertest(app)

describe('Test endpoint response', (): void => {
  it('Test Main endpoint', async (): Promise<void> => {
    const response = await request.get('/')
    expect(response.status).toBe(200)
  })
})
