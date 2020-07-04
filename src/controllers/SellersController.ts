import { Request, Response } from 'express'
import connection from '../connection'

export default class UsersController {
    async index(req: Request, res: Response) {
        connection.query('SELECT * FROM vendedores', (err: any, result: any) => {
            if (err) {
                console.log(err)
                res.status(400).send(err)
            }
            res.status(200).send(result.rows)
        })
    }

    async show(req: Request, res: Response) {
        const {
            params: { document },
        } = req
        connection.query(`SELECT * FROM vendedores WHERE cpf_cnpj = '${document}'`, (err: any, result: any) => {
            if (err) {
                res.status(400).send(err)
            }
            res.status(200).send(result.rows)
        })
    }

    async create(req: Request, res: Response) {
        const {
            document,
            phone,
            firstName,
            lastName,
            corporateName,
            fantasyName,
            email,
            activity,
            city,
            state,
            password,
        } = req.body

        const getStateInfo = await connection.query(`SELECT id FROM estados WHERE sigla = $1`, [state])
        const getCityInfo = await connection.query(`SELECT * FROM cidades WHERE nom_cidade = $1`, [city])

        if (getStateInfo.rowCount === 0 && getCityInfo.rowCount === 0) {
            res.status(400).send({
                error: 'Não encontramos nenhum local com esse nome',
            })
        }

        connection.query(
            `
                INSERT INTO vendedores (cpf_cnpj, telefone, nome, sobrenome, razao_social, fantasia, email, ramo_atividade, fk_cidade, senha) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                document,
                phone,
                firstName,
                lastName,
                corporateName,
                fantasyName,
                email,
                activity,
                getCityInfo.rows[0].id,
                password,
            ],
            (err: any, result: any) => {
                if (err) {
                    res.status(400).send(err)
                }
                res.status(200).send({
                    message: 'Registro criado com sucesso',
                    data: req.body,
                })
            }
        )
    }
}
