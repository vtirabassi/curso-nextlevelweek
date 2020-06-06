import express, { request, response } from 'express'
import {celebrate, Joi} from 'celebrate'
import PointsController from './controllers/PointsController'
import ItemController from './controllers/ItemsController'
import multer from 'multer'

import multerConfig from './config/multer'

const routes = express.Router() 

const itemsController = new ItemController()
const pointsController = new PointsController()

const upload = multer(multerConfig)

routes.get('/items', itemsController.index)

routes.post('/points', 
    upload.single('image'),  
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()
        })
    },  {
        abortEarly: false
    }), 
    pointsController.create)

routes.get('/points/:id', pointsController.show)
routes.get('/points', pointsController.index)

export default routes