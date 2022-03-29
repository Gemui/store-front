import express from 'express'
import usersRoutes from './api/users.routes'
import productsRoutes from './api/products.routes'
import categoriesRoutes from './api/categories.routes'
import ordersRoutes from './api/orders.routes'

const routes = express.Router()

routes.use('/users', usersRoutes)
routes.use('/products', productsRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/orders', ordersRoutes)

export default routes
