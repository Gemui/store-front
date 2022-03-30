import { body, param } from 'express-validator'
import { UserStore } from '../models/user.model'

const userStore = new UserStore()

export class UserRequestValidator {
  public validateRegister = [
    body('username', 'userName should be exists and not empty').exists().bail().notEmpty().bail().isLength({ min: 2, max: 100 }),
    body('password', 'Invalid password should be 6 character or more')
      .exists()
      .bail()
      .isLength({ min: 6 }),
    body('firstname', 'firstname should exists and length betwenn 2 to 5')
      .exists()
      .bail()
      .notEmpty()
      .bail()
      .isLength({ min: 2, max: 50 }),
    body('lastname')
      .exists()
      .bail()
      .notEmpty()
      .bail()
      .isLength({ min: 2, max: 50 }),
  ]

  public validateLogin = [
    body('username', 'userName should be exists and not empty')
      .exists()
      .bail()
      .notEmpty(),
    body('password', 'Invalid password should be 6 character or more')
      .exists()
      .bail()
      .isLength({ min: 6 }),
  ]

  public validateUserId = [
    param('id')
      .exists()
      .bail()
      .notEmpty()
      .bail()
      .isInt()
      .bail()
      .custom(async (value) => {
        const isUserExists = await userStore.getByColumn('id', value)
        if (!isUserExists) {
          return Promise.reject(`user_id ${value} not valid`)
        }
      }),
  ]
}
