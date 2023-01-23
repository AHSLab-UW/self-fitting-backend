// mock echo tcp server
const net = require('net')
const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log(data.toString())
    })
})

server.listen(33337, () => {
    console.log('server bound')
})
