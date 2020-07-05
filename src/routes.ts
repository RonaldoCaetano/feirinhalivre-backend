import express from 'express'

import UsersController from './controllers/UsersController'
import ProductsController from './controllers/ProductsController'
import CategoriesController from './controllers/CategoriesController'
import SellersController from './controllers/SellersController'
import ZenviaController from './controllers/ZenviaController'

const routes = express.Router()
const usersController = new UsersController()
const productsController = new ProductsController()
const categoriesController = new CategoriesController()
const sellersController = new SellersController()
const zenviaController = new ZenviaController()

routes.get('/users', usersController.index)
routes.get('/user/:phone', usersController.show)
routes.post('/user', usersController.create)

routes.get('/products', productsController.index)
routes.get('/product/:name', productsController.show)
routes.post('/product', productsController.create)

routes.get('/categories', categoriesController.index)
routes.get('/category/:id', categoriesController.show)
routes.post('/category', categoriesController.create)

routes.get('/sellers', sellersController.index)
routes.get('/seller/:phone', sellersController.show)
routes.post('/seller', sellersController.create)

routes.post('/message', zenviaController.createTextMessage)

export default routes
