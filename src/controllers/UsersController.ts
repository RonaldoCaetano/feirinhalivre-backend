import { Request, Response } from 'express'
import connection from '../connection'

export default class UsersController {
    async index(req: Request, res: Response) {
        connection.query('SELECT * FROM clientes', (err: any, result: any) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    }

    async show(req: Request, res: Response) {
        const { params: { phone } } = req
        connection.query(`SELECT * FROM clientes WHERE telefone = '${phone}'`, (err: any, result: any) => {
            if (err) {
                res.status(400).send(err)
            }
            res.status(200).send(result.rows);
        })
    }

    async create(req: Request, res: Response) {
        const { document = "", phone, password = '123', email = "", firstName, lastName = "" } = req.body

        connection.query(`
            INSERT INTO clientes(cpf_cnpj, senha, telefone, nome, sobrenome, email) 
            VALUES('${document}', '${password}', '${phone}', '${firstName}', '${lastName}', '${email}')`, 
            (err: any, result: any) => {
                if (err) {
                    res.status(400).send(err)
                }
                res.status(200).send(result);
            }
        )
    }
}