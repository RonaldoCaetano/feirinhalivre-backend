import { Request, Response } from 'express'
import connection from '../connection'
import axios from 'axios'
import FormData from 'form-data'

export default class UsersController {
    async index(req: Request, res: Response) {
        const {
            query: { city, sellerPhone },
        } = req
        if (city) {
            connection.query(
                `SELECT * FROM produtos pro INNER JOIN produtos_imagens img ON img.fk_produto = pro.id WHERE cidade = '${city}'`,
                (err: any, result: any) => {
                    if (err) {
                        res.status(400).send(err)
                    }
                    res.status(200).send(result.rows)
                }
            )
        }

        if (sellerPhone) {
            const getSellerInfo = await connection.query(`SELECT * FROM vendedores WHERE telefone = '${sellerPhone}'`)

            if (getSellerInfo?.rows?.length) {
                connection.query(
                    `SELECT * FROM produtos pro INNER JOIN produtos_imagens img ON img.fk_produto = pro.id WHERE fk_vendedor = '${getSellerInfo.rows[0].id}'`,
                    (err: any, result: any) => {
                        if (err) {
                            res.status(400).send(err)
                        }
                        res.status(200).send(result.rows)
                    }
                )
            }
        }
    }

    async show(req: Request, res: Response) {
        const {
            params: { name },
        } = req

        connection.query(
            'SELECT * FROM produtos pro INNER JOIN produtos_imagens img ON img.fk_produto = pro.id WHERE nome = $1',
            [name],
            (err: any, result: any) => {
                if (err) {
                    console.log(err)
                    res.status(400).send(err)
                }

                res.status(200).send(result.rows)
            }
        )
    }

    async create(req: Request, res: Response) {
        const {
            name,
            description,
            basePrice,
            listPrice = 0,
            weight = 0,
            width = 0,
            height = 0,
            length = 0,
            category = 1,
            imageUrl,
            phone,
        } = req.body

        const getSellerInfo = await connection.query(
            `SELECT ven.id, cid.nom_cidade FROM vendedores ven INNER JOIN cidades cid ON ven.fk_cidade = cid.id  WHERE telefone = '${phone}'`
        )

        if (getSellerInfo?.rowCount > 0) {
            await connection.query(
                `
                INSERT INTO produtos (nome, descricao, preco_base, preco, peso, comprimento, altura, largura, fk_categoria, fk_vendedor, cidade) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    name,
                    description,
                    basePrice,
                    listPrice,
                    weight,
                    length,
                    height,
                    width,
                    category,
                    getSellerInfo.rows[0].id,
                    getSellerInfo.rows[0].nom_cidade,
                ]
            )

            const getInfoFromProduct = await connection.query('SELECT * FROM produtos WHERE nome = $1', [name])

            if (getInfoFromProduct?.rows?.length) {
                JSON.parse(imageUrl).forEach(async (image: any) => {
                    const data = new FormData()
                    data.append('image', image)

                    const config: any = {
                        method: 'post',
                        url: 'https://api.imgur.com/3/image',
                        headers: {
                            Authorization: 'Client-ID b7631a53628082f',
                            ...data.getHeaders(),
                        },
                        data: data,
                    }

                    await axios(config).then(async (result) => {
                        await connection.query(`INSERT INTO produtos_imagens(fk_produto, url_imagem) VALUES ($1, $2)`, [
                            getInfoFromProduct.rows[0].id,
                            result.data.data.link,
                        ])
                    })
                })

                res.status(200).send({
                    message: 'Registro criado com sucesso',
                    data: getInfoFromProduct.rows,
                })
            }
        }
    }
}
