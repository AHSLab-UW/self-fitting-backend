const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

// serve react app html
app.use(express.static("dist"));

app.listen(port, () => {
  console.log(`React app listening on port ${port}`);
});

const net = require("net");

// client.on("data", (data) => {
//   console.log(`Data received: ${data.toString("utf-8")}$`);
// });

// act as intermediate for react app and tcp server on get request
app.get("/device", (req, res) => {
  const client = net.connect({ port: 33337, host: "10.0.0.1" }, () => {
    console.log("Connected to tcp config!");
  });

  const command = req.query.command;

  // send command to tcp server
  client.write(command + "\n");

  // Listen for the response from the TCP server
  client.on("data", (data) => {
    console.log(`Received response from MHA: \n\n ${data}`);
    // Convert the response from the TCP server to an HTTP response
    res.status(200).send(data);
    // Close the TCP connection
    client.end();
  });

  // Handle TCP errors
  client.on("error", (err) => {
    console.error("TCP error:", err);
    res.status(500).json({
      error: "An error occurred while communicating with the TCP server",
    });
  });
});

// store all requests from /store in a csv
app.get("/store", (req, res) => {
  const time = req.query.time;
  const name = req.query.name;
  const a = req.query.a;
  const coordinate = req.query.coordinate;
  const gainDelta = req.query.gainDelta;
  const glast = req.query.glast;
  const step = req.query.step;

  const data = `${time},${name},${a},${coordinate},${gainDelta},${glast},${step}\n`;

  const filename = `./logs/${name}_${new Date()
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
    .replace("/", "_").replace("/", "_")}.csv`;

  fs.appendFile(filename, data, (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.status(200).send("Data stored");
});
