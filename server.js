const express = require('express')
const app = express()
const port = 3000

// serve react app html
app.use(express.static('dist'))

app.listen(port, () => {
    console.log(`React app listening on port ${port}`)
})

const net = require('net')

const client = net.connect({port: 33337, host: "10.0.0.1"}, () => {
    console.log('Connected to tcp config!')
})

client.on('data', (data) => {
    console.log(`Data received: ${data.toString("utf-8")}$`)
})


// act as intermediate for react app and tcp server on get request
app.get('/device', (req, res) => {
    const command = req.query.command

    // send command to tcp server
    // set up tcp
    // bind client to port 33337
    // send command to tcp server
    client.write(command + '\n')

    // send response to react app
    console.log(`Command send: '${command}'`)
    res.send(`Command send: '${command}'`)
})
