const PG = require('pg')
const connectionString = 'postgres://postgres:itm@pass@35.247.245.183:5432/feirinha'

const connection = new PG.Client(connectionString)

connection.connect()

export default connection