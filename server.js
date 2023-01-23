const express = require('express')
const app = express()
const port = 3000

// serve react app html
app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// act as intermediate for react app and tcp server on get request
app.get('/device', (req, res) => {
    const command = req.query.command
    console.log(command)
    // send command to tcp server
    // set up tcp
    const net = require('net')
    // bind client to port 33337
    const client = net.connect({port: 33337}, () => {
        console.log('connected to server')
    })
    // send command to tcp server
    client.write(command)
    // send response to react app
    res.send('Command sent')
})
