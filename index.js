const express = require('express')
const app = express()
const members = require('./members.json')

// library InfluxDB 2.0
const {InfluxDB} = require('@influxdata/influxdb-client')
// config influxDB
const token = '1wteQbLpReD0UKtxTf4bQ4h-kAgqtPqYIuy01l3fH4xwLBb4gYJmFQx1DHK_PxQmXoX6y5TQb6h_DuLwM_HA8g=='
const org = 'rcs'
const bucket = 'HappyMeter'
// lcient InfluxDB 2.0
const client = new InfluxDB({url: 'http://localhost:8086', token: token})


// Middleware
app.use(express.json())

// route to get all member name
app.get('/members', (req,res) => {
    res.status(200).json(members)
})

app.post('/', registerHappyPoint)

// open listening
port = 6500
app.listen(port, () => {
    console.log("Listen on port : " + port)
  })

function registerHappyPoint(req,res) {
    // register on influx
    const {Point} = require('@influxdata/influxdb-client')
    const writeApi = client.getWriteApi(org, bucket)

    const point = new Point('happy')
        .stringField('member', req.body.member)
        .stringField('date', Date.now())
        .intField('happy', req.body.happy)
    writeApi.writePoint(point)
    writeApi
        .close()
        .then(() => {
            console.log('FINISHED')
        })
        .catch(e => {
            console.error(e)
            console.log('\\nFinished ERROR')
        })

    res.status(200)
    console.log("Data registered")
}