import Client from '../database'
import bcrypt from 'bcrypt'
import { Model } from './model'
import User from '../types/user.type'

export class UserStore extends Model {
  tableName = 'users'

  async authenticate(
    username: string,
    password: string
  ): Promise<User | null | void> {
    try {
      const conn = await Client.connect()
      const userQuery = await Client.query(
        'select * from users where username = ($1)',
        [username]
      )
      conn.release()

      if (userQuery.rows.length) {
        const result = userQuery.rows[0]
        if (
          bcrypt.compareSync(
            password + process.env.BCRYPT_PASSWORD,
            result.password
          )
        ) {
          return result as unknown as User
        }

        return null
      }

      return null
    } catch (e) {
      throw new Error(
        `Unable to authenticate (${username}): ${(e as Error).message}`
      )
    }
  }

  async create(user: User) {
    try {
      const conn = await Client.connect()

      const hash: string = bcrypt.hashSync(
        user.password + process.env.BCRYPT_PASSWORD,
        Number(process.env.SALT_ROUNDS)
      )

      const userQuery = await Client.query(
        'insert into users (username, password, firstname, lastname) values ( ($1) ,($2), ($3), ($4) ) returning *',
        [user.username, hash, user.firstname, user.lastname]
      )
      conn.release()
      return userQuery.rows[0]
    } catch (e) {
      throw new Error(
        `Unable to create (${user.username}): ${(e as Error).message}`
      )
    }
  }
}
