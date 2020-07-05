import { Request, Response } from 'express'
import { Client, TextContent, FileContent } from '@zenvia/sdk'

export default class ZenviaController {
    async createTextMessage(req: Request, res: Response) {
        const { phone, message } = req.body

        const client = new Client('L8-45Et5oYhBTsXw_6OHdpSZ-TQH7iO5t71P')
        const whatsapp = client.getChannel('whatsapp')
        const content = new TextContent(message)

        whatsapp
            .sendMessage('yellow-anchovy', `55${phone}`, content)
            .then((response: any) => {
                res.status(200).send({
                    message: 'Sucesso',
                    status: '200',
                    response,
                })
            })
            .catch((error: any) => {
                res.status(400).send({
                    message: 'Erro ao enviar a mensagem',
                    status: '400',
                    error,
                })
            })
    }

    async createFileMessage(req: Request, res: Response) {
        const { phone, url, extension, description } = req.body

        const client = new Client('kQWxWxvmEMlG0o_LsGDoJ0G3D7q693TCf1o4')
        const whatsapp = client.getChannel('whatsapp')
        const content = new FileContent(url, extension, description)

        whatsapp
            .sendMessage('yellow-anchovy', phone, content)
            .then((response: any) => {
                res.status(200).send(response)
            })
            .catch((error: any) => {
                res.status(400).send(error)
            })
    }
}
