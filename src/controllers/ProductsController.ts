import { Request, Response } from 'express'
import connection from '../connection'

export default class UsersController {
    async index(req: Request, res: Response) {
        connection.query('SELECT * FROM produtos', (err: any, result: any) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    }

    async show(req: Request, res: Response) {
        const { params: { id } } = req
        connection.query(`SELECT * FROM produtos WHERE id = '${id}'`, (err: any, result: any) => {
            if (err) {
                res.status(400).send(err)
            }
            res.status(200).send(result.rows);
        })
    }

    async create(req: Request, res: Response) {
        const { name, description, basePrice, listPrice = 0, weight = 0, width = 0, height = 0, length = 0, category = 1 } = req.body

        connection.query(`
            INSERT INTO produtos(nome, descricao, preco_base, preco, peso, comprimento, altura, largura, fk_categoria) 
            VALUES('${name}', '${description}', '${basePrice}', '${listPrice}', ${weight}, '${length}', '${width}', '${height}', ${category})`, 
            (err: any, result: any) => {
                if (err) {
                    res.status(400).send(err)
                }
                res.status(200).send(result);
            }
        )
    }
}