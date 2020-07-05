import express from 'express'
import cors from 'cors'

import routes from './routes'

const app = express()

app.use(cors())
app.use(express.urlencoded({ limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(routes)

const port = process.env.PORT || 3333

app.listen(port)
