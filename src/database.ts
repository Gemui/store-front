import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const { 
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT
  
 } = process.env 

const Client = new Pool({
  host: POSTGRES_HOST,
  database: process.env.ENV == "test" ? POSTGRES_DB_TEST  : POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT),
})

export default Client;