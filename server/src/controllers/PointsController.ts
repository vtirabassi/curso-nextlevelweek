import knex from '../database/connection'
import { Request, Response } from 'express'

class PointsController {

    async create (request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body
    
        const transaction = await knex.transaction()
    
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await transaction('points').insert(point)
    
        const pointId = insertedIds[0]

        const poinItems = items
        .split(',')
        .map((item: string) => Number(item.trim())) 
        .map((item_id: number) => {
            return {
                item_id,
                point_id: pointId
            }
        })
    
        await transaction('point_items').insert(poinItems)

        await transaction.commit()
    
        return response.json({
            id: pointId,
            ...point
        })
    }

    async show (request: Request, response: Response)  {
        const {id} = request.params

        const point = await knex('points').where('id', id).first()

        if(!point){
            return response.status(400).json({message: 'Point not found.'})
        }

        const items = await knex('items')
        .join('point_items', 'items.id',  '=', 'point_items.item_id')
        .where('point_items.point_id', id).select('items.title')

        const serializedPoint  = {
            ... point,
            image_url: `http://192.168.0.26:3333/uploads/${point.image}`
        } 

        return response.json({
            serializedPoint,
            items
        })
            
    }

    async index (request: Request, response: Response) {
        const {city, uf, items} = request.query

        console.log(city)
        console.log(uf)
        console.log(items)

        const parseItems = String(items)
        .split(',')
        .map(i => Number(i.trim()))

        console.log(parseItems)

        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parseItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

        const serializedPoints  = points.map(point => {
            return {
                ... point,
                image_url: `http://192.168.0.26:3333/uploads/${point.image}`
            }
        })

        return response.json(serializedPoints)
    }

}

export default PointsController