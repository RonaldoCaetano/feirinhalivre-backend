import { Request, Response } from 'express'
import connection from '../connection'

export default class UsersController {
    async index(req: Request, res: Response) {
        connection.query('SELECT * FROM vendedores', (err: any, result: any) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    }

    async show(req: Request, res: Response) {
        const { params: { document } } = req
        connection.query(`SELECT * FROM vendedores WHERE cpf_cnpj = '${document}'`, (err: any, result: any) => {
            if (err) {
                res.status(400).send(err)
            }
            res.status(200).send(result.rows);
        })
    }

    async create(req: Request, res: Response) {
        const { document, phone, firsName, lastName, coporateName, fantasyName, email, activity, city, state, password } = req.body

        connection.query(`
            INSERT INTO estados (nom_estado, sigla) 
            VALUES (
                '${state}', 
                '${state}'
            )`,
            (err: any, result: any) => {
                if (err) {
                    res.status(400).send(err)
                }
                
                connection.query(`
                    INSERT INTO cidades (cod_cidade, nom_cidade, fk_estado) 
                    VALUES (
                        '${city}', 
                        '${city}',
                        1
                    )`,
                    (err: any, result: any) => {
                        if (err) {
                            res.status(400).send(err)
                        }
                        
                        connection.query(`
                            INSERT INTO vendedores (cpf_cnpj, telefone, nome, sobrenome, razao_social, fantasia, email, ramo_atividade, fk_cidade, senha) 
                            VALUES (
                                '${document}', 
                                '${phone}', 
                                '${firsName}', 
                                '${lastName}', 
                                '${coporateName}', 
                                '${fantasyName}', 
                                '${email}', 
                                '${activity}',
                                '${city}',
                                '${password}'
                            )`, 
                            (err: any, result: any) => {
                                if (err) {
                                    res.status(400).send(err)
                                }
                                res.status(200).send(result);
                            }
                        )
                    }
                )
            }
        )
    }
}